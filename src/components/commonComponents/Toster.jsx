import { toast } from "react-toastify";

const CommonToast = (message, type = "info") => {
  const colorMap = {
    success: { background: "#62f273", color: "#FFFFFF" },
    error: { background: "#ED3434", color: "#FFFFFF" },
    info: { background: "#7E7E7E", color: "#FFFFFF" },
    warning: { background: "#ED3434", color: "#FFFFFF" },
  };

  toast[type](message, {
    style: colorMap[type],
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export default CommonToast;
