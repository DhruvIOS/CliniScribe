const { fal } = require("@fal-ai/client");

// Configure fal globally
fal.config({
  credentials: process.env.FAL_KEY
});

class VideoGenerationService {
  constructor() {
    this.operations = new Map(); // Store ongoing operations
  }

  /**
   * Generate health education video based on consultation data
   */
  async generateHealthVideo(consultationData) {
    try {
      const prompt = this.createHealthVideoPrompt(consultationData);

      console.log('🎬 Starting Veo 3 video generation with fal.ai, prompt:', prompt);

      const result = await fal.subscribe("fal-ai/google-veo3", {
        input: {
          prompt: prompt,
          duration: "8s",
          aspect_ratio: "16:9"
        },
        logs: true,
        onQueueUpdate: (update) => {
          console.log('🎬 Queue update:', update.status);
        },
      });

      const operationId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.operations.set(operationId, {
        result,
        consultationData,
        startTime: new Date(),
        status: 'ready',
        prompt,
        videoUrl: result.video?.url
      });

      console.log('✅ Video generation completed for operation:', operationId);
      console.log('🎬 Video URL:', result.video?.url);

      return {
        operationId,
        status: 'ready',
        estimatedTime: '30-60 seconds',
        prompt: prompt.substring(0, 100) + '...'
      };

    } catch (error) {
      console.error('❌ Error starting video generation:', error);
      throw new Error('Failed to start video generation: ' + error.message);
    }
  }

  /**
   * Poll video generation status
   */
  async pollVideoStatus(operationId) {
    try {
      const storedOp = this.operations.get(operationId);
      if (!storedOp) {
        throw new Error('Operation not found');
      }

      return {
        operationId,
        status: storedOp.status,
        progress: storedOp.status === 'ready' ? 100 : this.calculateProgress(storedOp.startTime),
        videoFile: storedOp.videoUrl,
        downloadUrl: storedOp.videoUrl,
        error: storedOp.error,
        elapsedTime: Math.floor((new Date() - storedOp.startTime) / 1000)
      };

    } catch (error) {
      console.error('❌ Error polling video status:', error);
      return {
        operationId,
        status: 'error',
        error: error.message
      };
    }
  }

  /**
   * Get download URL for generated video
   */
  async getVideoDownloadUrl(operationId) {
    try {
      const storedOp = this.operations.get(operationId);
      if (!storedOp || !storedOp.videoFile) {
        throw new Error('Video not ready or operation not found');
      }

      // For Veo 3, the video file should already contain the download URL
      // or we need to use the files API differently
      let downloadUrl;

      if (typeof storedOp.videoFile === 'string' && storedOp.videoFile.startsWith('http')) {
        // Already a URL
        downloadUrl = storedOp.videoFile;
      } else {
        // Try to get the download URL using the correct API method
        try {
          // Use the file reference to get download URL
          downloadUrl = await this.ai.files.download({
            file: storedOp.videoFile
          });
        } catch (downloadError) {
          console.warn('⚠️ Direct download failed, attempting alternative method');
          // Alternative: the videoFile might already contain the URL
          downloadUrl = storedOp.videoFile.uri || storedOp.videoFile.downloadUrl || storedOp.videoFile;
        }
      }

      return {
        downloadUrl,
        filename: `health_video_${operationId}.mp4`,
        videoFile: storedOp.videoFile
      };

    } catch (error) {
      console.error('❌ Error getting video download URL:', error);
      throw new Error('Failed to get video download URL: ' + error.message);
    }
  }

  /**
   * Create health-focused video prompt based on consultation
   */
  createHealthVideoPrompt(consultationData) {
    const symptoms = consultationData.symptoms || consultationData.advice?.symptoms || 'general symptoms';

    // Create direct symptom-based animation prompt
    let basePrompt;

    if (symptoms.toLowerCase().includes('back pain') || symptoms.toLowerCase().includes('spine') || symptoms.toLowerCase().includes('vertebra')) {
      basePrompt = `Medical animation showing human spine and vertebrae. Highlight the affected back area with gentle pulsing red indication for pain. Show cross-section view of spine structure. Clean 3D anatomical visualization.`;
    } else if (symptoms.toLowerCase().includes('headache') || symptoms.toLowerCase().includes('head pain')) {
      basePrompt = `Medical animation of human head and brain. Show pain areas with gentle red pulsing. Include cross-section brain view and pain pathway visualization. Clean anatomical 3D graphics.`;
    } else if (symptoms.toLowerCase().includes('stomach') || symptoms.toLowerCase().includes('abdominal') || symptoms.toLowerCase().includes('belly')) {
      basePrompt = `Medical animation of human digestive system. Show stomach and abdominal organs with highlighted problem areas. Clean 3D anatomical visualization with gentle color indicators.`;
    } else if (symptoms.toLowerCase().includes('chest') || symptoms.toLowerCase().includes('heart') || symptoms.toLowerCase().includes('breathing')) {
      basePrompt = `Medical animation of human chest cavity showing heart and lungs. Highlight affected areas with gentle indicators. Clean 3D anatomical cross-section view.`;
    } else if (symptoms.toLowerCase().includes('throat') || symptoms.toLowerCase().includes('sore throat') || symptoms.toLowerCase().includes('neck')) {
      basePrompt = `Medical animation of human throat and neck anatomy. Show internal throat structure with highlighted problem areas. Clean 3D anatomical visualization.`;
    } else {
      // Generic body system animation based on symptoms
      basePrompt = `Medical animation showing human body systems related to: "${symptoms}". Clean 3D anatomical visualization highlighting affected areas with gentle color indicators.`;
    }

    // Complete the prompt with strict duration and style specifications
    const fullPrompt = `${basePrompt} CRITICAL: Duration must be EXACTLY 8 seconds, no longer. Style: Professional medical animation, clean minimal design, bright clear colors, smooth camera movement, no text overlays, no narration. Keep it short and concise. 8 seconds only. Focus on clear visual education about: "${symptoms}".`;

    return fullPrompt;
  }

  /**
   * Calculate estimated progress based on elapsed time
   */
  calculateProgress(startTime) {
    const elapsed = (new Date() - startTime) / 1000; // seconds
    const estimatedTotal = 45; // 45 seconds estimated for 8-second videos
    return Math.min(Math.floor((elapsed / estimatedTotal) * 100), 95);
  }

  /**
   * Clean up completed operations
   */
  cleanupOperation(operationId) {
    const deleted = this.operations.delete(operationId);
    console.log(deleted ? `🧹 Cleaned up operation: ${operationId}` : `⚠️ Operation not found for cleanup: ${operationId}`);
    return deleted;
  }

  /**
   * Get all active operations (for debugging/monitoring)
   */
  getActiveOperations() {
    return Array.from(this.operations.entries()).map(([id, op]) => ({
      operationId: id,
      status: op.status,
      startTime: op.startTime,
      elapsedTime: Math.floor((new Date() - op.startTime) / 1000),
      consultation: {
        illness: op.consultationData.advice?.illness || op.consultationData.illness,
        symptoms: op.consultationData.symptoms?.substring(0, 50) + '...'
      }
    }));
  }

  /**
   * Health check for the service
   */
  async healthCheck() {
    try {
      // Simple check to see if the API is accessible
      return {
        status: 'healthy',
        activeOperations: this.operations.size,
        apiConfigured: !!process.env.GOOGLE_GENAI_API_KEY
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        activeOperations: this.operations.size,
        apiConfigured: !!process.env.GOOGLE_GENAI_API_KEY
      };
    }
  }
}

module.exports = new VideoGenerationService();