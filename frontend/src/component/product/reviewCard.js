import { Rating } from "@material-ui/lab";
import profilePng from "../../images/Profile.png";
const ReviewCard = ({ review }) => {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
  };
  return (
    <div className="reviewCard">
      <div className="reviewImg_name">
        <img src={profilePng} alt="User" className="reviewImg" />
        <p>{review.name}</p>
      </div>
      <Rating {...options} />
      <p className="reviewCardComment">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
