import React, { useState, useMemo, useCallback } from "react";
import './App.css'
import Grid from "@material-ui/core/Grid";
import { useDropzone } from "react-dropzone";
import CardDisplay from "./CardDisplay";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const Home = () => {
  const [pathToPic, setPathToPic] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const formData = new FormData();
    formData.append("profile_pic", acceptedFiles[0]);

    fetch("/upload-profile-pic", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(({pathToImage}) => {
          if (pathToImage) setPathToPic(pathToImage)
          else console.log('Image upload failed')
        })
      .catch((e) => console.log(e.message));
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ accept: "image/*", multiple: false, onDrop });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <Grid
      style={{ height: "100vh" }}
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      {!pathToPic ? (
        <div className="container">
        <h1 className="title">[DEBUG ME GENTLY]</h1>
        <img src="https://www.thecoderpedia.com/wp-content/uploads/2020/06/Programming-Memes-Programmer-while-sleeping.jpg" className="pic" alt="bug" />
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <p className="info">Your goal is to allow the upload of a profile picture</p>
            <p>Drag 'n' drop a file here, or click to select file</p>
          </div>
        </div>
      ) : (
        <CardDisplay pic={pathToPic} />
      )}
    </Grid>
  );
}

export default Home
