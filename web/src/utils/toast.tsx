import toast from "react-hot-toast";

export const promisedToast = async (fn: Promise<any>, successMsg?: string) => {
  return toast.promise(fn, {
    loading: "Processing...",
    success: <b>{successMsg || "Processed successfully"}</b>,
    error: (err) => (
      <b>
        {err?.response?.data?.msg ||
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Something went wrong."}
      </b>
    ),
  });
};

