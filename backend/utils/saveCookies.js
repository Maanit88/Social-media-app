const accessTokenOptions = {
  httpOnly: true,
  expires: new Date(Date.now() + 15 * 60 * 1000),
  secure: process.env.ENV === "production",
  sameSite: "strict",
};

const refreshTokenOptions = {
  httpOnly: true,
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  secure: process.env.ENV === "production",
  samesSite: "strict",
};

export const saveCookies = (accessToken, refreshToken, res) => {
  const accessCookie = res.cookie(
    "accessToken",
    accessToken,
    accessTokenOptions
  );

  const refreshCookie = res.cookie(
    "refreshToken",
    refreshToken,
    refreshTokenOptions
  );

  return { accessCookie, refreshCookie };
};
