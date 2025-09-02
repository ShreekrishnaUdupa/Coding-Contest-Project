import { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';

export default function GetProblemsPage () {

  const {name} = useParams();
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);

  useEffect (() => {

  }, [name]);
  
  return (
    <div> This is the Get Problems Page </div>
  );
}