import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import { FaMicrophone, FaCamera } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Webcam from "react-webcam";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState(null);

  const webcamRef = useRef(null);
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const handleSubmit = useCallback(
    (finalQuery = query || transcript) => {
      if (finalQuery.trim()) {
        alert(`Searching for: ${finalQuery}`);
        setQuery("");
        resetTranscript();
      }
    },
    [query, transcript, resetTranscript]
  );

  const handleMicClick = () => {
    if (isRecording) {
      SpeechRecognition.stopListening();
      setIsRecording(false);
      handleSubmit(transcript);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      setIsRecording(true);
    }
  };

  const handleCameraClick = () => {
    setShowCamera((prev) => !prev);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const captureImage = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
  };

  useEffect(() => {
    if (!listening && isRecording && transcript) {
      handleSubmit(transcript);
      setIsRecording(false);
    }
  }, [listening, isRecording, transcript, handleSubmit]);

  return (
    <div className="search-bar p-3">
      <InputGroup>
        <FormControl
          placeholder="Search"
          value={isRecording ? transcript : query}
          onChange={handleChange}
        />
        <Button variant="outline-secondary" onClick={handleMicClick}>
          <FaMicrophone color={isRecording ? "red" : "black"} />
        </Button>
        <Button variant="outline-secondary" onClick={handleCameraClick}>
          <FaCamera />
        </Button>
        <Button variant="outline-primary" onClick={() => handleSubmit()}>
          Search
        </Button>
      </InputGroup>

      {showCamera && (
        <div className="camera mt-3">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{ facingMode: "environment" }}
            onUserMediaError={() => alert("Camera access error!")}
          />
          <Button
            onClick={captureImage}
            className="mt-2"
            variant="outline-success"
          >
            Capture
          </Button>
          {image && (
            <div className="mt-3">
              <img src={image} alt="Captured" className="img-fluid rounded" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
