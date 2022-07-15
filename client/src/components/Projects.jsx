import Spinner from "./spinner"
import { useQuery } from "@apollo/client"
import { GET_PROJECTS } from "../queries/projectQueries"
import ProjectCard from "./projectCard"

export default function Project() {
  const {loading, error, data}= useQuery(GET_PROJECTS)
        if(loading) return <Spinner/>
        if (error) return <p>Something went Wrong</p>


    return (
    <>
    { data.projects.length > 0 ? (
        <div className="row mt-4">
            { data.projects.map((project)=>(
                <ProjectCard key = {project.id} project= {project}/>
            ))}
        </div>
    ) : (<p>No Projects</p>)}
    </>
  )
}
