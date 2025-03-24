module.exports = {
    async getVersionInfo(platform) {
      return {
        version: "2.1.0",
        force_update: false,
        description: "优化支付流程，修复已知问题",
        download_url: platform === 'android' 
          ? "https://android.download" 
          : "https://ios.download"
      };
    }
  };