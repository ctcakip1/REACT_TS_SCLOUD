'use client'
import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Grid, MenuItem, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary' }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

function LinearWithValueLabel() {
    const [progress, setProgress] = React.useState(10);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={progress} />
        </Box>
    );
}
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
function InputFileUpload() {
    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}

        >
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}
const Step2 = () => {
    const category = [
        {
            value: 'CHILL',
            label: 'CHILL'
        },
        {
            value: 'WORKOUT',
            label: 'WORKOUT'
        },
        {
            value: 'PARTY',
            label: 'PARTY'
        },
    ];
    return (
        <div>
            <div>
                <div>Your uploading track:</div>
                <LinearWithValueLabel />
            </div>

            <div>
                <Grid container
                    mt={5}
                    spacing={2}
                >
                    <Grid item
                        xs={6}
                        md={4}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: "10px"
                        }}
                    >

                        <div style={{
                            background: "#ccc",
                            width: 250,
                            height: 250
                        }}>
                            <div>

                            </div>
                        </div>
                        <div>
                            <InputFileUpload />
                        </div>
                    </Grid>
                    <Grid
                        xs={6}
                        md={8}>
                        <TextField
                            margin='dense'
                            fullWidth
                            label="Title"
                            name='title'
                            autoFocus
                            variant="standard"
                        />
                        <TextField margin='dense'
                            fullWidth
                            label="Description"
                            name='description'
                            autoFocus
                            variant="standard" />
                        <TextField
                            sx={{
                                mt: 5
                            }}
                            margin='dense'
                            fullWidth
                            label="Category"
                            name='category'
                            autoFocus
                            variant="standard"
                            select
                        >
                            {category.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Button variant='outlined'
                            sx={{
                                mt: 5
                            }}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
export default Step2;