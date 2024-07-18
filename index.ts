// import path from "path";
import app from "./app";

const PORT = process.env.PORT || 3000;

// Catch-all route
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// START SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
