import { useParams, Navigate } from "react-router-dom";
import CourseSyllabusPage from "@/components/CourseSyllabusPage";
import { courseSyllabi } from "@/data/courses";

const CoursePage = () => {
  const { slug } = useParams();
  const data = slug ? courseSyllabi[slug] : null;
  if (!data) return <Navigate to="/courses" replace />;
  return <CourseSyllabusPage data={data} />;
};

export default CoursePage;
