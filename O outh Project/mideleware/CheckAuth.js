import HttpError from "./HttpError.js";

const checkAuth = (req, res, next) => {
  try {
    if (!req.user) {
      return res.redirect("/");
    }

    return next();
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

export default checkAuth;