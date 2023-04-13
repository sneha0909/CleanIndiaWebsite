import React, { useState } from 'react'

const PreviewImage = ({ file }) => {
    const [preview, setPreview] = useState();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        setPreview(reader.result);
    };


    return <div>

        <img src={preview} alt="preview" width="200px" height="200px" />

    </div>
};

export default PreviewImage;