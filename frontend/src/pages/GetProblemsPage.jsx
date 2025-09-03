import { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';

export default function GetProblemsPage () {

  const {name: contestName} = useParams();
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);

  useEffect (() => {
    
    const response = fetch (`http://localhost:4000/api/problems/${contestName}`);
    const data = response.json();

    console.log(data);

  }, [contestName]);
  
  return (
    <div> This is the Get Problems Page </div>
  );
}