import { useState } from "react";
import { Grid, Stack, Typography, Button } from "@mui/material";

export default function UploadPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedFile(file || null);
    };

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={6}>
                <Stack>
                    {/* ... */}
                    <Typography variant="h6">Upload Image:</Typography>
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    <label htmlFor="image-upload">
                        <Button component="span">Choose File</Button>
                    </label>
                </Stack>
            </Grid>
            {/* ... */}
        </Grid>
    );
}