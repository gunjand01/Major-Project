import React, { useState } from "react";
import "../styles/uploadResume.css";

const UploadResume = () => {
  const [isDragOver, setDragOver] = useState(false);

  const handleDragOver = (evt) => {
    evt.preventDefault();
    setDragOver(true);
  };

  const handleDragEnter = (evt) => {
    evt.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (evt) => {
    evt.preventDefault();
    setDragOver(false);
    const file = evt.dataTransfer.files[0];
    updateFileName(file);
  };

  const updateFileName = (file) => {
    const label = document.querySelector(".upload-label");
    label.textContent = `Selected file: ${file.name}`;
  };

  return (
      <div className={`app-main ${isDragOver ? "dragover" : ""}`}>
        <div className="page page-drop">
          <div className="ring">
            <div className="container">
              <section className="drop-story">
                <div className="drop-secondary">
                  <div className="media-figure dropzone-container">
                    <div
                      className="dropzone"
                      id="dropzone"
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="dropzone-content--with-image dropzone-content">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="69"
                          height="51"
                          viewBox="0 0 69 51"
                          className="dropzone-content__image tw-mx-auto tw-mb-1"
                        >
                          <defs>
                            <linearGradient
                              id="icon-drop-folder_svg__a"
                              x1="34.5"
                              x2="34.5"
                              y1="48.67"
                              y2="0.19"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop offset="0.67" stop-color="#112caf"></stop>
                              <stop offset="0.77" stop-color="#2250f4"></stop>
                            </linearGradient>
                          </defs>
                          <path
                            fill="url(#icon-drop-folder_svg__a)"
                            d="M62.93 6.8H37.11L29.84.19H6.07a3.53 3.53 0 0 0-3.53 3.53v41.42a3.53 3.53 0 0 0 3.53 3.53h56.86a3.53 3.53 0 0 0 3.53-3.53V10.33a3.53 3.53 0 0 0-3.53-3.53"
                          ></path>
                          <path
                            fill="#ffdd73"
                            d="M6.83 12.56h53.01V35.1H6.83z"
                          ></path>
                          <path
                            fill="#fff6d0"
                            d="M10.27 9.83h53.01v22.54H10.27z"
                          ></path>
                          <path
                            fill="#a6bffd"
                            d="M63.17 50.81H5.83a3.46 3.46 0 0 1-3.5-3.06l-2.07-29a3.25 3.25 0 0 1 3.29-3.51h61.9a3.25 3.25 0 0 1 3.29 3.51l-2.07 29a3.46 3.46 0 0 1-3.5 3.06"
                          ></path>
                        </svg>
                        <p className="para">
                          Drag and drop your
                          <br /> Resume File here
                        </p>
                        <p className="dropzone-browse">
                          Or,{" "}
                          <label
                            htmlFor="dropzone-upload"
                            className="upload-label para"
                          >
                            browse to upload
                          </label>
                          <input
                            type="file"
                            accept=".pdf"
                            name="files[]"
                            title=" "
                            id="dropzone-upload"
                            className="tw-sr-only"
                            onChange={(e) => updateFileName(e.target.files[0])}
                          />
                        </p>
                      </div>
                      <span className="drop-ring"></span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div> 
  );
};

export default UploadResume;
