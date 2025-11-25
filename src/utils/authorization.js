export const handlePolicies = (policies = []) => {
  return (req, res, next) => {
    if (policies.includes("PUBLIC")) return next();

    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "No autenticado",
      });
    }

    const userData = req.user.user || req.user;
    const role = (userData.role || "user").toUpperCase();

    if (!policies.includes(role)) {
      return res.status(403).json({
        status: "error",
        message: "No autorizado",
      });
    }

    next();
  };
};