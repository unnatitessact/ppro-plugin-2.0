import { useEffect, useState } from "react";
import { subscribeBackgroundColor, evalES } from "../lib/utils/bolt";
import { ImportResult } from "../../shared/universals";
import "./main.scss";

const Main = () => {
  const [bgColor, setBgColor] = useState("#282c34");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [recentImports, setRecentImports] = useState<
    { name: string; date: string }[]
  >([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  // Videos from public folder with direct URLs
  const videos = [
    {
      src: "https://videos.pexels.com/video-files/27220617/12097143_1080_1920_30fps.mp4",
      name: "video.mp4",
    },
    {
      src: "https://videos.pexels.com/video-files/5199861/5199861-uhd_1440_2560_25fps.mp4",
      name: "memoria.mp4",
    },
    {
      src: "https://videos.pexels.com/video-files/4769556/4769556-uhd_1440_2732_25fps.mp4",
      name: "trendy.mp4",
    },
  ];

  // Function to handle video click
  const handleVideoClick = (videoSrc: string, videoName: string) => {
    if (isUploading) return; // Don't allow clicking while already uploading

    setCurrentVideo(videoSrc);
    setIsUploading(true);
    setUploadStatus(`Importing ${videoName} to timeline...`);

    // Use the direct URL for the video
    const videoUrl = videoSrc;

    // Use the video name as filename
    const filename = videoName;

    // Escape any special characters in the URL to prevent JavaScript errors
    const escapedUrl = videoUrl.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

    alert(escapedUrl);

    // Call our ExtendScript function to download and import the file using evalES
    evalES(`
      var result = downloadAndImportToTimeline("${escapedUrl}", "${filename}");
      JSON.stringify(result);
    `)
      .then((resultStr) => {
        try {
          const result = JSON.parse(resultStr) as ImportResult;
          if (result && result.status === "success") {
            setUploadStatus(`Success: ${videoName} added to timeline`);
            // Add to recent imports
            setRecentImports((prev) => [
              { name: filename, date: new Date().toLocaleTimeString() },
              ...prev.slice(0, 4), // Keep only the 5 most recent imports
            ]);
          } else {
            alert(`Error: ${result.message || "Unknown error"}`);
            setUploadStatus(`Error: ${result.message || "Unknown error"}`);
          }
        } catch (e) {
          alert(`JSON main error: ${e}`);
          setUploadStatus(`Error parsing result: ${resultStr}`);
        }
      })
      .catch((error) => {
        setUploadStatus(`Error: ${error.toString()}`);
      })
      .finally(() => {
        setIsUploading(false);
        setCurrentVideo(null);
      });
  };

  useEffect(() => {
    if (window.cep) {
      subscribeBackgroundColor(setBgColor);
    }
  }, []);

  return (
    <div
      className="app"
      style={{
        backgroundColor: bgColor,
        height: "100vh",
        padding: "20px",
        color: "#ffffff",
      }}
    >
      <div className="app__header">
        <h1 style={{ marginBottom: "24px", textAlign: "center" }}>
          Tessact Video Import Plugin
        </h1>

        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ marginBottom: "16px" }}>
            Click any video to import it to Premiere Pro timeline
          </h2>
          <p style={{ marginBottom: "20px", opacity: 0.8 }}>
            Select any of the videos below to download and add it to your
            current Premiere Pro timeline.
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {videos.map((video, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  cursor: isUploading ? "not-allowed" : "pointer",
                  opacity: isUploading && currentVideo !== video.src ? 0.6 : 1,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  transform:
                    currentVideo === video.src ? "scale(1.05)" : "scale(1)",
                  boxShadow:
                    currentVideo === video.src
                      ? "0 0 20px rgba(0, 255, 0, 0.5)"
                      : "none",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
                onClick={() =>
                  !isUploading && handleVideoClick(video.src, video.name)
                }
              >
                <video
                  src={video.src}
                  style={{
                    width: "300px",
                    borderRadius: "8px",
                    border: "2px solid transparent",
                    borderColor:
                      currentVideo === video.src
                        ? "rgba(0, 255, 0, 0.8)"
                        : "transparent",
                  }}
                  autoPlay
                  muted
                  loop
                  controls
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    padding: "10px",
                    background: "rgba(0,0,0,0.7)",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {video.name}
                </div>
                {currentVideo === video.src && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0,0,0,0.5)",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(0,0,0,0.8)",
                        padding: "10px 20px",
                        borderRadius: "20px",
                      }}
                    >
                      Importing...
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          {/* Status column */}
          <div style={{ flex: 2 }}>
            {uploadStatus && (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: uploadStatus.includes("Error")
                    ? "rgba(255, 0, 0, 0.2)"
                    : "rgba(0, 255, 0, 0.2)",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              >
                <h3 style={{ marginBottom: "8px" }}>Status:</h3>
                <div>{uploadStatus}</div>
              </div>
            )}
          </div>

          {/* Recent imports column */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <h2 style={{ marginBottom: "16px" }}>Recent Imports</h2>
              {recentImports.length > 0 ? (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {recentImports.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        padding: "12px",
                        borderBottom:
                          index < recentImports.length - 1
                            ? "1px solid rgba(255,255,255,0.1)"
                            : "none",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>{item.name}</div>
                      <div style={{ opacity: 0.7 }}>{item.date}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    opacity: 0.7,
                    padding: "20px 0",
                  }}
                >
                  No recent imports
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
