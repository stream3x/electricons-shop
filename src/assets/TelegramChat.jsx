import Image from "next/image";
import Link from "../Link";

export default function TelegramChat() {
  return (
    <Link href="https://vk.com/away.php?to=https%3A%2F%2Ft.me%2FLingvoMSK_bot&cc_key=" passHref target="_blank">
      <Image
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
        src="/images/telegramChat.png"
        alt={"Telegram chatbot"}
        quality={100}
       />
    </Link>
  )
}