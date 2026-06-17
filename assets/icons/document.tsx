import Svg, { Path } from "react-native-svg";

interface DocumentProps {
  color?: string;
}

const Document: React.FC<DocumentProps> = ({ color = "#BFBFBF" }) => {
  return (
    <Svg width="19" height="20" viewBox="0 0 19 20" fill="none">
      <Path
        d="M8.51471 19.0833C4.85439 19.0833 3.02423 19.0833 1.88711 18.0094C0.75 16.9354 0.75 15.207 0.75 11.75L0.75 8.08333C0.75 4.62637 0.750001 2.89788 1.88712 1.82394C3.02423 0.75 4.85439 0.75 8.51471 0.75L9.4853 0.75C13.1456 0.75 14.9758 0.75 16.1129 1.82394C17.25 2.89788 17.25 4.62637 17.25 8.08333M8.54167 19.0833H9.91667"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <Path
        d="M5.33301 5.33398H12.6663"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <Path
        d="M5.33301 9.91699H9.91634"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <Path
        d="M14.042 15.9577L13.215 18.8482C13.1778 18.9934 13.3214 19.1193 13.4607 19.0636L15.2808 18.3368C15.3682 18.3019 15.4658 18.3019 15.5532 18.3368L17.3907 19.0706C17.5266 19.1249 17.6683 19.006 17.6382 18.863L16.9376 15.8675M18.167 13.5795C18.167 12.0632 16.9358 10.834 15.417 10.834C13.8982 10.834 12.667 12.0632 12.667 13.5795C12.667 15.0958 13.8982 16.325 15.417 16.325C16.9358 16.325 18.167 15.0958 18.167 13.5795Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default Document;
