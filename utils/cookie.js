const setCookie = (res, key, token) => {
  return res.cookie(key, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export default setCookie;
