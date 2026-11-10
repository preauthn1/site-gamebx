import bus from "@/utils/bus"
import { pwa } from "@/utils/pwa";

export default (url: string | undefined, isNewWindow: boolean = false) => {
  if (url) {
    if (url.startsWith("http") || url.startsWith("mailto")) {
      if (isNewWindow) {
        window.open(url)
      } else {
        window.location.href = url
      }
    } else if (url.startsWith("bus-")) {
      if (url === "bus-pddShow") {
        bus.emit("pddShow")
      }
      if (url === "bus-changeLangShow") {
        bus.emit("changeLangShow")
      }
      if (url === "bus-install") {
        pwa.value?.prompt()
      }
    } else {
      useRouter().push(url)
    }
  }
}