import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image, Video, X, Check, Clock, Award, Play, Pause } from 'lucide-react';

export const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState(null); // 'image' or 'video'
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAnalyzed, setIsAnalyzed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [poseResults, setPoseResults] = useState({
        poseName: '',
        accuracy: 0,
        feedback: []
    });

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Reset states
        setIsAnalyzed(false);
        setPoseResults({
            poseName: '',
            accuracy: 0,
            feedback: []
        });

        // Check file type
        if (selectedFile.type.startsWith('image/')) {
            setFileType('image');
            setFile(selectedFile);
        } else if (selectedFile.type.startsWith('video/')) {
            setFileType('video');
            setFile(selectedFile);
        } else {
            alert('Please upload an image or video file');
            e.target.value = null;
        }
    };

    // Handle drag and drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];

            // Reset states
            setIsAnalyzed(false);
            setPoseResults({
                poseName: '',
                accuracy: 0,
                feedback: []
            });

            // Check file type
            if (droppedFile.type.startsWith('image/')) {
                setFileType('image');
                setFile(droppedFile);
            } else if (droppedFile.type.startsWith('video/')) {
                setFileType('video');
                setFile(droppedFile);
            } else {
                alert('Please upload an image or video file');
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // Process the file (call backend API)
    const processFile = () => {
        setIsProcessing(true);

        // Simulate API call delay
        setTimeout(() => {
            // Mock analysis results
            const poses = [
                {
                    name: "Warrior I",
                    accuracy: 78,
                    feedback: [
                        "Extend your arms fully",
                        "Square your hips to the front"
                    ]
                },
                {
                    name: "Warrior II",
                    accuracy: 86,
                    feedback: [
                        "Extend your arms parallel to the floor"
                    ]
                },
                {
                    name: "Tree Pose",
                    accuracy: 65,
                    feedback: [
                        "Focus on a point in front of you",
                        "Press your foot into your inner thigh",
                        "Keep your standing leg straight"
                    ]
                },
                {
                    name: "Downward Dog",
                    accuracy: 92,
                    feedback: []
                }
            ];

            const randomPose = poses[Math.floor(Math.random() * poses.length)];

            setPoseResults({
                poseName: randomPose.name,
                accuracy: randomPose.accuracy,
                feedback: randomPose.feedback
            });

            setIsProcessing(false);
            setIsAnalyzed(true);

            // Draw pose keypoints if it's an image
            if (fileType === 'image') {
                drawDummyKeypointsOnImage();
            }

        }, 2000);
    };

    // Handle video playback
    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Update video time
    const updateTime = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    // Format time (seconds to MM:SS)
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Draw dummy keypoints on the image
    const drawDummyKeypointsOnImage = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw a generic pose skeleton (simplified)
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#c7d2fe';

        // Draw random points as a placeholder
        // In a real app, these would be the actual keypoints from the model
        const points = [];
        for (let i = 0; i < 15; i++) {
            points.push({
                x: 100 + Math.random() * 300,
                y: 50 + Math.random() * 300
            });
        }

        // Draw connections between points
        for (let i = 0; i < points.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[i + 1].x, points[i + 1].y);
            ctx.stroke();
        }

        // Draw points
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    };

    // Load video metadata
    useEffect(() => {
        if (videoRef.current && fileType === 'video' && file) {
            videoRef.current.onloadedmetadata = () => {
                setDuration(videoRef.current.duration);
            };
        }
    }, [file, fileType]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-indigo-800">Upload & Analyze Yoga Poses</h1>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Upload section */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
                    {!file ? (
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-center min-h-96"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <Upload size={48} className="text-gray-400 mb-4" />
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Upload your yoga practice</h3>
                            <p className="text-gray-500 mb-6">Drag and drop an image or video file here, or click to browse</p>
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
                            >
                                <span>Select File</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                                className="hidden"
                            />
                            <p className="text-gray-400 text-sm mt-4">
                                Supported formats: JPG, PNG, MP4, MOV (max. 100MB)
                            </p>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Media preview */}
                            {fileType === 'image' ? (
                                <div className="relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Uploaded yoga pose"
                                        className="w-full h-auto rounded-lg"
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        className="absolute top-0 left-0 w-full h-full"
                                        width="500"
                                        height="400"
                                    />
                                </div>
                            ) : (
                                <div className="relative">
                                    <video
                                        ref={videoRef}
                                        src={URL.createObjectURL(file)}
                                        className="w-full h-auto rounded-lg"
                                        onTimeUpdate={updateTime}
                                        onEnded={() => setIsPlaying(false)}
                                    />

                                    {/* Video controls */}
                                    {fileType === 'video' && (
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <button
                                                    onClick={togglePlayPause}
                                                    className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"
                                                >
                                                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                                </button>
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <span>{formatTime(currentTime)}</span>
                                                    <span>/</span>
                                                    <span>{formatTime(duration)}</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className="bg-indigo-600 h-1.5 rounded-full"
                                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* File info and actions */}
                            <div className="mt-4 flex justify-between items-center">
                                <div className="flex items-center">
                                    {fileType === 'image' ? <Image size={20} className="text-indigo-600 mr-2" /> : <Video size={20} className="text-indigo-600 mr-2" />}
                                    <span className="text-gray-700">{file.name}</span>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            setFileType(null);
                                            setIsAnalyzed(false);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = '';
                                            }
                                        }}
                                        className="p-2 text-red-500 hover:text-red-700"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Analysis button */}
                            {!isAnalyzed && !isProcessing && (
                                <button
                                    onClick={processFile}
                                    className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors"
                                >
                                    <span>Analyze Pose</span>
                                </button>
                            )}

                            {/* Processing indicator */}
                            {isProcessing && (
                                <div className="mt-4 w-full bg-indigo-100 text-indigo-700 py-3 rounded-lg flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                    <span>Processing...</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Results panel */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-indigo-800 mb-6">Analysis Results</h2>

                    {isAnalyzed ? (
                        <>
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Detected Pose</h3>
                                <div className="bg-indigo-100 p-4 rounded-lg">
                                    <p className="text-xl font-semibold text-indigo-700">{poseResults.poseName}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <h3 className="text-lg font-medium">Accuracy</h3>
                                    <div className="flex items-center">
                                        <Award size={18} className="text-yellow-500 mr-1" />
                                        <span className={`font-semibold ${poseResults.accuracy >= 80 ? 'text-green-600' :
                                                poseResults.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {poseResults.accuracy}%
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full ${poseResults.accuracy >= 80 ? 'bg-green-500' :
                                                poseResults.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${poseResults.accuracy}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-3">Feedback</h3>
                                {poseResults.feedback.length > 0 ? (
                                    <ul className="space-y-2">
                                        {poseResults.feedback.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="inline-flex items-center justify-center bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full text-sm mr-2 mt-0.5">
                                                    {index + 1}
                                                </span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="bg-green-50 p-4 rounded-lg flex items-center">
                                        <Check size={20} className="text-green-600 mr-2" />
                                        <p className="text-green-700">Great form! Keep it up.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                            {file ? (
                                isProcessing ? (
                                    <>
                                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-gray-600">Analyzing your yoga pose...</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-gray-600 mb-4">
                                            Click the "Analyze Pose" button to get feedback on your yoga pose
                                        </p>
                                    </>
                                )
                            ) : (
                                <>
                                    <p className="text-gray-500">
                                        Upload an image or video to receive feedback on your yoga practice
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};