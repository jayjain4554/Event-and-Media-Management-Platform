import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Video, Loader2, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/ui/GlassCard';

export const UserProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  
  // States
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(user?.referenceSelfieUrl || '');
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Status reporting
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const previewUrlRef = useRef<string | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera capture stream
  useEffect(() => {
    setPreview(user?.referenceSelfieUrl || '');
  }, [user?.referenceSelfieUrl]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraActive(true);
    setFile(null);
    setSuccess('');
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 400, height: 400, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error(err);
      setError('Webcam access was denied or unsupported. Please use local file upload.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 400, 400);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            setFile(capturedFile);
            const url = URL.createObjectURL(capturedFile);
            if (previewUrlRef.current) {
              URL.revokeObjectURL(previewUrlRef.current);
            }
            previewUrlRef.current = url;
            setPreview(url);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      const url = URL.createObjectURL(selected);
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      previewUrlRef.current = url;
      setPreview(url);
      setSuccess('');
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or capture a selfie before submitting.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('selfie', file);

    try {
      const res = await api.post('/users/selfie', formData);
      const { referenceSelfieUrl } = res.data.data;
      updateUser({ referenceSelfieUrl });
      setSuccess('Reference selfie successfully updated. Facial discovery indexing is now live!');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred registering reference selfie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 select-none">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">User Profile</h1>
        <p className="text-dark-300 text-sm mt-1">
          Manage your account profile and configure reference photos face matching credentials
        </p>
      </div>

      {/* Success banner notifications */}
      {success && (
        <GlassCard className="!p-4 bg-teal-950/40 border-teal-500/20 text-teal-400 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle size={15} />
          <span>{success}</span>
        </GlassCard>
      )}

      {/* Error banner */}
      {error && (
        <GlassCard className="!p-4 bg-red-950/40 border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{error}</span>
        </GlassCard>
      )}

      {/* Core Selfie Configuration Card */}
      <GlassCard className="space-y-6 bg-glass-card border-glass-border">
        <div className="flex justify-between items-center pb-4 border-b border-glass-border/30">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Selfie Registration
            </h3>
            <p className="text-[10px] text-dark-300 font-semibold leading-relaxed">
              Provides the reference selfie vector embeddings for facial match discoveries
            </p>
          </div>

          <span className="text-[10px] bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2.5 py-0.5 rounded-full font-black tracking-widest uppercase">
            Active
          </span>
        </div>

        {/* Dynamic camera capture viewports */}
        <div className="flex flex-col items-center gap-5">
          {cameraActive ? (
            /* Webcam view container */
            <div className="relative rounded-2xl overflow-hidden border border-glass-border h-[280px] w-[280px] bg-black">
              <video
                ref={videoRef}
                playsInline
                muted
                className="h-full w-full object-cover scale-x-[-1]" // Mirror image
              />
              <button
                onClick={captureFrame}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md border border-brand-500/30"
              >
                Capture Frame
              </button>
            </div>
          ) : (
            /* Standard image preview box */
            <div className="relative h-[200px] w-[200px] rounded-full p-[3px] bg-gradient-to-tr from-brand-500 to-indigo-500 shadow-md">
              <div className="h-full w-full rounded-full border-2 border-dark-900 overflow-hidden bg-dark-800 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Selfie preview" className="h-full w-full object-cover" />
                ) : (
                  <Camera size={44} className="text-dark-500" />
                )}
              </div>
            </div>
          )}

          {/* Mode selectors */}
          {!cameraActive && (
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-glass-border hover:border-brand-500/20 hover:text-white rounded-xl text-xs font-bold text-dark-300 flex items-center gap-1 bg-dark-950"
              >
                <Upload size={13} />
                <span>Upload File</span>
              </button>
              <button
                onClick={startCamera}
                className="px-4 py-2 border border-glass-border hover:border-brand-500/20 hover:text-white rounded-xl text-xs font-bold text-dark-300 flex items-center gap-1 bg-dark-950"
              >
                <Video size={13} />
                <span>Camera Shoot</span>
              </button>
            </div>
          )}

          {/* Hidden HTML file select */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Action controls row */}
        {file && !cameraActive && (
          <form onSubmit={handleSubmit} className="pt-4 border-t border-glass-border/30">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold tracking-wide text-xs uppercase flex items-center justify-center gap-2 shadow-glass-glow transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Registering Selfie...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  <span>Register Face Selfie</span>
                </>
              )}
            </button>
          </form>
        )}
      </GlassCard>

      {/* User Details Details Card */}
      {user && (
        <GlassCard className="bg-glass-card border-glass-border space-y-4 text-xs font-semibold">
          <div className="flex justify-between items-center text-dark-300 border-b border-glass-border/30 pb-2">
            <span>Linked Name:</span>
            <span className="text-white font-extrabold">{user.name}</span>
          </div>
          <div className="flex justify-between items-center text-dark-300 border-b border-glass-border/30 pb-2">
            <span>Email Address:</span>
            <span className="text-white font-extrabold">{user.email}</span>
          </div>
          <div className="flex justify-between items-center text-dark-300">
            <span>Security Role:</span>
            <span className="text-brand-400 uppercase tracking-widest font-black">
              {user.role}
            </span>
          </div>
        </GlassCard>
      )}

      {/* HTML Video canvas backup */}
      <canvas ref={canvasRef} width={400} height={400} className="hidden" />
    </div>
  );
};
