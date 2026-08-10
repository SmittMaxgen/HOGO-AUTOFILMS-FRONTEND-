import { Editor } from "@tinymce/tinymce-react";
import { Box, Typography } from "@mui/material";

// Self-hosted TinyMCE — no cloud API key needed
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";
import "tinymce/skins/ui/oxide/skin.css";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/table";
import "tinymce/plugins/code";
import "tinymce/plugins/image";
import "tinymce/plugins/autoresize";

const RichTextEditor = ({ label, value, onChange, error, helperText }) => {
  return (
    <Box>
      {label && (
        <Typography
          variant="caption"
          sx={{ mb: 0.5, fontWeight: 700, color: "#424242", display: "block" }}
        >
          {label}
        </Typography>
      )}
      <Box
        sx={{
          border: error ? "1px solid #d32f2f" : "1px solid #e0e0e0",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Editor
          licenseKey="gpl"
          value={value}
          onEditorChange={(content) => onChange(content)}
          init={{
            height: 260,
            menubar: false,
            skin: false,
            content_css: false,
            plugins: "link lists table code image autoresize",
            toolbar:
              "undo redo | blocks | bold italic underline | " +
              "bullist numlist | link image table | code",
            autoresize_bottom_margin: 20,
            branding: false,
          }}
        />
      </Box>
      {error && helperText && (
        <Typography variant="caption" color="error" mt={0.5} display="block">
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default RichTextEditor;
