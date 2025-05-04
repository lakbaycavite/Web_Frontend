import { RxDownload } from "react-icons/rx";

const DownloadButton = ({ className }) => {
    // Replace this URL with your actual APK URL
    const apkUrl = import.meta.env.VITE_APK_URL

    return (
        <div className="download-container">
            <a
                href={apkUrl}
                className={className}
                download="app-release.apk"
            >
                <RxDownload size={20} />

                Download App
            </a>
        </div>
    );
};

export default DownloadButton;