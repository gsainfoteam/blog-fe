import Image from "next/image"
import DefaultImage from "@/app/image/default.svg"

type WritingProps = {
    title: string,
    content: string,
    date: string,
    writer: string
}
export default function Writing({title,content,date,writer}:WritingProps){
    return(
    <div className="w-[739px] h-[163px] pt-[24px] pb-[24px]" >
        <div className="flex gap-[36px]">
            <div className="flex flex-col justify-between">
                <div>
                    <strong>{title}</strong>
                    <p>{content}</p>
                </div>
                <p> {date} {writer} </p>
            </div>
            <Image
                src={DefaultImage}
                width={130}
                height={90}
                alt="Content Image"
            />
        </div>
    </div>
    )
}