import React from 'react'

export const Home = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch("api/student").then(r => r.json()).then(d => {
            console.log("The students are: ", d);
            setStudents(d);
        }).catch(e => console.log("The error fetching all students: ", e));
    }, []);
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Review</th>
                        <th>Cost</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        students.length === 0 ? <tr className="row waiting"><td className="row">Loading<span className="loading">...</span></td></tr> :
                            students.map(student => <tr key={student.id}>
                                <td>{student.Name}</td>
                                <td>{student.Description}</td>
                                <td>{student.Location}</td>
                                <td>{student.Date}</td>
                                <td>{student.Review}</td>
                                <td>{student.Cost}</td>
                                <td><a href={"/edit?id=" + student.id}>Edit</a></td>
                                <td onClick={() => { /*openDeleteModal(student.id);*/ }}>Delete</td>
                            </tr>)
                    }
                </tbody>
            </table>
        </div>
    )
}
export default Home;