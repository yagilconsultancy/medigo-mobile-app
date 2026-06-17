import { Briefcase, Building2, Home, MapPin } from "lucide-react-native";

export const getLocationTypeStyles = (type: string) => {
  switch (type?.toLowerCase()) {
    case "home":
      return { icon: <Home size={20} color="#3B82F6" />, bg: "#EFF6FF" };
    case "work":
      return { icon: <Briefcase size={20} color="#8B5CF6" />, bg: "#F5F3FF" };
    case "medical":
    case "hospital":
      return { icon: <Building2 size={20} color="#10B981" />, bg: "#ECFDF5" };
    default:
      return { icon: <MapPin size={20} color="#F59E0B" />, bg: "#FFFBEB" };
  }
};
