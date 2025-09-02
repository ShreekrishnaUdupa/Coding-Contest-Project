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

    <div className="h-screen w-full p-4 bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Monaco Editor in React</h1>

      <Editor
        height="80vh"          // editor height
        defaultLanguage="javascript"  // default language mode
        defaultValue={code}    // initial code
        theme="vs-dark"        // theme: "vs-dark" | "light"
        onChange={(value) => setCode(value)} // track changes
        options={{
          fontSize: 14,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />

      <button
        onClick={() => alert(code)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Run Code
      </button>
    </div>
  );
}