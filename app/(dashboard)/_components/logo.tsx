import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      height={100}
      width={130}
      alt="logo"
      src="/icon.jpg"
    />
  )
}