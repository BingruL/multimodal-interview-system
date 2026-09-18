const useTokenWithPat = () => {
  const getToken = () => {
    const token = process.env.VUE_APP_COZE_PAT || '';

    if (!token) {
      throw new Error(
        'Coze PAT 未配置，请在 interview-web/.env.local 中设置 VUE_APP_COZE_PAT',
      );
    }

    return token;
  };

  return { getToken };
};

export { useTokenWithPat };