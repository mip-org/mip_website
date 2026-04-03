import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeContextProvider } from "./ThemeContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import Docs from "./pages/Docs";
import DocArticle from "./pages/DocArticle";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import { Box } from "@mui/material";

export default function App() {
  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navbar />
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/docs/:slug" element={<DocArticle />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeContextProvider>
  );
}
