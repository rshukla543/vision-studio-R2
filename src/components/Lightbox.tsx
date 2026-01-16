import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface LightboxWrapperProps {
  open: boolean;
  close: () => void;
  slides: { src: string; alt?: string }[];
  index?: number;
}

export function LightboxWrapper({ open, close, slides, index = 0 }: LightboxWrapperProps) {
  return (
    <Lightbox
      open={open}
      close={close}
      slides={slides}
      index={index}
      plugins={[Zoom, Thumbnails]}
      animation={{ fade: 300, swipe: 300 }}
      carousel={{ finite: false }}
      controller={{ closeOnBackdropClick: true }}
      styles={{
        container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
        thumbnailsContainer: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
      }}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true,
      }}
    />
  );
}
