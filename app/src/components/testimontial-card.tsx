import React, { ReactNode } from "react";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  name: string;
  designation: string;
  content: string;
  photo?: string;
  className?: string;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
};

function TestimonialCard(props: Props) {
  let initials = ((fullname) =>
    fullname
      .map((n, i) => (i == 1 || i == fullname.length - 1) && n[0])
      .filter((n) => n)
      .join(""))(props.name.split(" ")).toUpperCase();

  function getRating() {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < props.rating) {
        stars.push(<StarFilledIcon key={i} />);
      } else {
        stars.push(<StarFilledIcon key={i} className="dark__color" />);
      }
    }
    return stars;
  }

  return (
    <div className={"single__testimonial__wraper " + props.className}>
      <div className="single__testimonial__inner">
        <div className="testimonial__img">
          <Avatar>
            <AvatarImage src={props.photo} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="testimonial__name">
            <h6>{props.name}</h6>
            <span>{props.designation}</span>
          </div>
        </div>
        <div className="testimonial__icon flex flex-row">{getRating()}</div>
      </div>

      <div className="testimonial__content">
        <p>{props.content}</p>
      </div>
    </div>
  );
}

export default TestimonialCard;
