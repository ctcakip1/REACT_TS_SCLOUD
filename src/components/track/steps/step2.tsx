'use client'
import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Grid, MenuItem, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useSession } from "next-auth/react"
import { sendRequest } from '@/utils/api';
import { useToast } from '@/utils/toast';

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

function LinearWithValueLabel(props: IProps) {

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={props.trackUpload.percent} />
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
function InputFileUpload(props: any) {
    const toast = useToast()
    const { setInfo, info } = props;
    const { data: session } = useSession();
    const handleUpload = async (image: any) => {
        const formData = new FormData()
        formData.append('fileUpload', image)
        try {
            const res = await axios.post("http://localhost:8000/api/v1/files/upload", formData, {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                    "target_type": "images",
                },
            })
            setInfo({
                ...info,
                imgUrl: res.data.data.fileName
            })
            // props.setTrackUpload({
            //     ...trackUpload,
            //     uploadedTrackName: res.data.data.fileName
            // })
        } catch (error) {
            //@ts-ignore
            toast.error(error?.response?.data?.message)
        }
    }
    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            onChange={(e) => {
                const event = e.target as HTMLInputElement
                if (event.files) {
                    handleUpload(event.files[0])
                }
            }}
        >
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}
interface IProps {
    trackUpload: {
        fileName: string,
        percent: number,
        uploadedTrackName: string
    }
    setValue: (v: number) => void;
}
interface INewTrack {
    title: string,
    description: string,
    trackUrl: string,
    imgUrl: string,
    category: string
}
const Step2 = (props: IProps) => {
    const toast = useToast()
    const { data: session } = useSession();
    const { trackUpload, setValue } = props;
    const [info, setInfo] = React.useState<INewTrack>({
        title: "",
        description: "",
        trackUrl: "",
        imgUrl: "",
        category: ""
    });
    React.useEffect(() => {
        if (trackUpload && trackUpload.uploadedTrackName) {
            setInfo({
                ...info,
                trackUrl: trackUpload.uploadedTrackName
            })
        }
    }, [trackUpload])
    console.log("check trackupload:", trackUpload)
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
    const handleSubmitForm = async () => {
        const res = await sendRequest<IBackendRes<ITrackTop[]>>({
            url: "http://localhost:8000/api/v1/tracks",
            method: "POST",
            body: {
                title: info.title,
                description: info.description,
                trackUrl: info.trackUrl,
                imgUrl: info.imgUrl,
                category: info.category
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        })
        if (res.data) {
            setValue(0)
            toast.success("create success")

        } else {
            toast.error(res.message)
        }
    }
    return (
        <div>
            <div>
                <div>{trackUpload.fileName}</div>
                <LinearWithValueLabel
                    trackUpload={trackUpload}
                    setValue={setValue}
                />
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
                                {info.imgUrl &&
                                    <img width={250}
                                        height={250}
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`} />
                                }
                            </div>
                        </div>
                        <div>
                            <InputFileUpload
                                setInfo={setInfo}
                                info={info}
                            />
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
                            value={info?.title}
                            onChange={(e) => {
                                setInfo({
                                    ...info,
                                    title: e.target.value,
                                })
                            }}
                        />
                        <TextField margin='dense'
                            fullWidth
                            label="Description"
                            name='description'
                            autoFocus
                            variant="standard"
                            value={info?.description}
                            onChange={(e) => {
                                setInfo({
                                    ...info,
                                    description: e.target.value,
                                })
                            }}
                        />
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
                            value={info?.category}
                            onChange={(e) => {
                                setInfo({
                                    ...info,
                                    category: e.target.value,
                                })
                            }}
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
                            onClick={() => handleSubmitForm()}
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