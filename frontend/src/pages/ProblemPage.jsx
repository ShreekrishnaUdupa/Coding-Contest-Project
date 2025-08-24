import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';

export default function ProblemPage () {
  
  const [number, setNumber] = useState(0);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [statement, setStatement] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [testCases, setTestCases] = useState('');

  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');

  const [submissions, setSubmissions] = useState([]);

  // useEffect (() => {

  //   const problemId = sessionStorage.getItem('problemId');

  //   fetch (`http://localhost:4000/api/problems/${problemId}`)
  //     .then(response => response.json())

  //     .then(data => {
        
  //       setNumber(data.number);
  //       setTitle(data.title);
  //       setDifficulty(data.difficulty);
  //       setStatement(data.statement);
  //       setInputFormat(data.inputFormat);
  //       setOutputFormat(data.outputFormat);
  //     })

  //     .catch (error => console.log('Failed to fetch problem details'));

  //   fetch (`http://localhost:4000/api/problems/${problemId}/test-cases?sample=true`)
  //     .then(response => response.json())
  //     .then(data => {

  //       setLanguage(data.language);
  //       setCode(data.code);
  //     })
  //     .catch (error => console.log('Failed to fetch test-cases details'));

  //   fetch (`http://localhost:4000/api/problems/${problemId}/submissions`)
  //     .then(response => response.json())
  //     .then(data => {

  //       setSubmissions(data.submissions);
  //     })
  //     .catch (error => console.log('Failed to fetch submissions details'));
  // }, []);

  return (
    <>
      
    </>

  );
}