import React, { useState, useRef, useEffect } from 'react';
import { Camera, Play, Square, Clock, Award, Info } from 'lucide-react';

export const LiveDetection = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [sessionTime, setSessionTime] = useState(0);
    const [detectedPose, setDetectedPose] = useState(null);
    const [feedback, setFeedback] = useState([]);
    const [accuracy, setAccuracy] = useState(0);
    const [showInfo, setShowInfo] = useState(false);

    const timerRef = useRef(null);

    // Start the webcam stream
    const startStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);

                // Start the timer
                timerRef.current = setInterval(() => {
                    setSessionTime(prevTime => prevTime + 1);
                }, 1000);

                // Start pose detection
                startPoseDetection();
            }
        } catch (err) {
            console.error("Error accessing webcam:", err);
            alert("Could not access webcam. Please ensure you have given permission.");
        }
    };

    // Stop the webcam stream
    const stopStream = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsStreaming(false);

            // Clear the timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            // Reset detection state
            setDetectedPose(null);
            setFeedback([]);
            setAccuracy(0);
        }
    };

    // Format time from seconds to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    // Clean up on component unmount
    useEffect(() => {
        return () => {
            stopStream();
        };
    }, []);

    // Mock pose detection function - in a real app, this would call the backend API
    const startPoseDetection = () => {
        // Simulate pose detection with dummy data
        const poseDetectionInterval = setInterval(() => {
            // In a real app, you would send video frames to the backend for processing
            // and receive pose data back
            const poses = [
                "Warrior I",
                "Warrior II",
                "Tree Pose",
                "Downward Dog",
                "Mountain Pose"
            ];

            const randomPose = poses[Math.floor(Math.random() * poses.length)];
            const randomAccuracy = Math.floor(Math.random() * 41) + 60; // 60-100%

            setDetectedPose(randomPose);
            setAccuracy(randomAccuracy);

            // Generate feedback based on pose and accuracy
            const feedbackOptions = {
                "Warrior I": [
                    "Extend your arms fully",
                    "Square your hips to the front",
                    "Bend your front knee at 90 degrees"
                ],
                "Warrior II": [
                    "Extend your arms parallel to the floor",
                    "Turn your back foot at 90 degrees",
                    "Gaze over your front hand"
                ],
                "Tree Pose": [
                    "Focus on a point in front of you",
                    "Press your foot into your inner thigh",
                    "Keep your standing leg straight"
                ],
                "Downward Dog": [
                    "Press your heels toward the floor",
                    "Lengthen your spine",
                    "Relax your neck and head"
                ],
                "Mountain Pose": [
                    "Stand tall with feet together",
                    "Engage your core muscles",
                    "Relax your shoulders down"
                ]
            };

            // Select 1-3 feedback points based on accuracy
            const numFeedbackPoints = Math.max(1, Math.floor((100 - randomAccuracy) / 15));
            const selectedFeedback = [];

            const poseFeedback = feedbackOptions[randomPose] || [];
            for (let i = 0; i < numFeedbackPoints && i < poseFeedback.length; i++) {
                selectedFeedback.push(poseFeedback[i]);
            }

            setFeedback(selectedFeedback);

            // In a real app, you would also draw pose keypoints on the canvas here
            drawDummyPoseKeypoints();

        }, 3000); // Update every 3 seconds

        return () => clearInterval(poseDetectionInterval);
    };

    // Draw dummy pose keypoints (placeholder)
    const drawDummyPoseKeypoints = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw a generic pose skeleton (simplified)
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 4;
        ctx.fillStyle = '#c7d2fe';

        // Draw random points as a placeholder
        // In a real app, these would be the actual keypoints from the model
        const points = [];
        for (let i = 0; i < 15; i++) {
            points.push({
                x: 150 + Math.random() * 340,
                y: 100 + Math.random() * 280
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
            ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-indigo-800">Live Yoga Pose Detection</h1>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Video feed and controls */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
                    <div className="relative">
                        <video
                            ref={videoRef}
                            className="w-full h-auto rounded-lg bg-gray-100"
                            autoPlay
                            playsInline
                            style={{ display: isStreaming ? 'block' : 'none' }}
                        />
                        <canvas
                            ref={canvasRef}
                            className="absolute top-0 left-0 w-full h-full"
                            width="640"
                            height="480"
                            style={{ display: isStreaming ? 'block' : 'none' }}
                        />

                        {!isStreaming && (
                            <div className="bg-gray-100 rounded-lg flex flex-col items-center justify-center p-12 min-h-96">
                                <Camera size={64} className="text-gray-400 mb-4" />
                                <p className="text-gray-500 text-center mb-6">
                                    Click start to begin your yoga session with live pose detection
                                </p>
                                <button
                                    onClick={startStream}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
                                >
                                    <Play size={20} />
                                    <span>Start Session</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Clock size={20} className="text-indigo-600" />
                            <span className="font-mono text-lg">{formatTime(sessionTime)}</span>
                        </div>

                        {isStreaming && (
                            <button
                                onClick={stopStream}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition-colors"
                            >
                                <Square size={18} />
                                <span>End Session</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Feedback panel */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-indigo-800">Pose Analysis</h2>
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                            <Info size={20} />
                        </button>
                    </div>

                    {showInfo && (
                        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                            <p className="text-sm text-indigo-700">
                                Our AI analyzes your pose in real-time and provides feedback to help you improve.
                                The accuracy score shows how well your pose matches the ideal form.
                            </p>
                        </div>
                    )}

                    {isStreaming ? (
                        <>
                            {detectedPose ? (
                                <>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium mb-2">Detected Pose</h3>
                                        <div className="bg-indigo-100 p-4 rounded-lg">
                                            <p className="text-xl font-semibold text-indigo-700">{detectedPose}</p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex justify-between mb-2">
                                            <h3 className="text-lg font-medium">Accuracy</h3>
                                            <div className="flex items-center">
                                                <Award size={18} className="text-yellow-500 mr-1" />
                                                <span className={`font-semibold ${accuracy >= 80 ? 'text-green-600' :
                                                    accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                    {accuracy}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className={`h-2.5 rounded-full ${accuracy >= 80 ? 'bg-green-500' :
                                                    accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${accuracy}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-3">Feedback</h3>
                                        {feedback.length > 0 ? (
                                            <ul className="space-y-2">
                                                {feedback.map((item, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="inline-flex items-center justify-center bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full text-sm mr-2 mt-0.5">
                                                            {index + 1}
                                                        </span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 italic">Great form! Keep it up.</p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-600">Detecting your pose...</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <p className="text-gray-500 mb-2">
                                Start a session to receive real-time feedback on your yoga poses
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};