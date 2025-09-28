import React, { useEffect, useState } from 'react';
import { Clock, Code, Play, CheckCircle, Sparkles, Loader , Search  } from 'lucide-react';
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import NativeContestPool from '../contracts/NativeContestPool.json';
import AbilityNFT from "../Contracts/AbilityNFT.json"
import axios from 'axios';

type Question = {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  testcase: any; 
}

const ContestPage = () => {
  const [contract, setContract] = useState(null);
  const [nftContract, setNftContract] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [isContestActive, setIsContestActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [code, setCode] = useState('// Write your solution here \n Use solve as you function name');
  const [nft, setNft] = useState("");
  const [query, setQuery] = useState("")


  const { address } = useAccount();

  useEffect(() => {

    setIsLoading(true)
    if (window.ethereum) {
      const privateKey = "c5900f468e094055fd0c9783250d99c0a7708b6d660ec409b0a1932c975c3126"
      const provider = new ethers.providers.JsonRpcProvider("https://sepolia.optimism.io");
      const signer = new ethers.Wallet(privateKey, provider);

      // Create a new contract instance with the signer
      const contractInstance = new ethers.Contract(
        "0x876246e2bF7A8AF68F39Fc4F30f2984aA21cF800",
        NativeContestPool,
        signer
      );

      const nftContact = new ethers.Contract(
        "0x857af0dD002a374F697108Ec424e7Be979af2c16",
        AbilityNFT, 
        signer
      )
      console.log(contractInstance)
      setContract(contractInstance);
      setNftContract(nftContact)
    }
  }, []);

  useEffect(() => {

    const getQuestionFromJsonBin = async (id : any) => {
      const url = `https://api.jsonbin.io/v3/b/${id}/latest`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            "X-Master-Key": "$2a$10$pwsz5BuKi/IF766zPPxB8er9t5Mm6I9hOt9IxtXB1cwAJzj/egipi"
          }
        });
        const data = await response.json();

        console.log(data)
        return data.record;
      } catch (error) {
        console.error("Error fetching question from JSONBin:", error);
        return null;
      }
          
      }
    const fetchContestData = async () => {

      setIsLoading(true)

      const getIfContestHasQuestion = await contract.s_switch();

      console.log("getIfContestHasQuestion:" , getIfContestHasQuestion);

      if(getIfContestHasQuestion == 0){
        // const questionBinID = await axios.get("devanganaendpoint")
        const questionBinID = "68d863f1d0ea881f408d49bc"

        const getquestionsFromId = await getQuestionFromJsonBin(questionBinID);
        
        setQuestion({
          id : questionBinID, 
          title : getquestionsFromId.topic,
          difficulty: "Easy",
          description: getquestionsFromId.description, 
          testcase : getquestionsFromId["test cases"]
        })

        const setIdInContract = await contract.setJsonBin(questionBinID)

      }else{
        const questionId = await contract?.getJsonBin();

        const questionInJson = await getQuestionFromJsonBin(questionId);

        setQuestion({
          id : questionId, 
          title : questionInJson.topic,
          difficulty: "Easy",
          description: questionInJson.description, 
          testcase : questionInJson["test cases"]
        })
      }

      setStartTime(new Date());
      setEndTime(new Date(new Date().getTime() + 60 * 60 * 1000)); // 1 hour later
      setIsContestActive(true);
      setTimeLeft(60 * 5); // 5 min in seconds 

      setIsLoading(false);
    };

    if(contract){
      fetchContestData();
    }
  }, [contract]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && isContestActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }

    const getResult = async() => {
      const result = await contract.calculateResultRandomly({value : 15000000000001})
      
      setTimeout(() => {
      },20)

      const winner = await contract.s_winner()
      if(winner == address){
        alert("You WON!!!!!")
      }else{
        alert(`${winner} won`)
      }
      
    }
    if(timeLeft <= 0){
      getResult()
    }
  }, [timeLeft, isContestActive]);

  const calculateResult = async() =>{
    const result = await contract.calculateResultRandomly({value : 15000000000001})
  }

  const getResult = async() => {
      const winner = await contract.s_winner()
      if(winner == address){
        alert("You WON!!!!!")
      }else{
        alert(`${winner} won`)
      }
      
    }

  const formatTime = (seconds : number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string | undefined) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const submitSolution = async() => {
      if(code.length == 0){
        alert("You have to write code first!!")
      }

      // const codeExecutionResponse = await axios.post("http://localhost:3000/", {
      //   code : code,
      //   functionName : "solve",
      //   testCases: question.testcase
      // })
      const response = true

      if(response){
        const completeQuestion = await contract.markParticipantTaskComplete(address);
      }else{
        alert("You code couldn't pass the test cases")
      }
      // console.log(codeExecutionResponse)
  }

  const handleSearch = async() =>{
      const typeOfNFT = await nftContract.getBuffs(query)

      const extratime = typeOfNFT.TimeBuff + timeLeft
      setTimeLeft(extratime)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900b to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Solv3 Contest</h1>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/20">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">Live Contest</span>
            </div>
          </div>

           <div className="flex w-full max-w-md">
        {/* Input */}
        <input
          type="text"
          placeholder="Search here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-l-2xl border border-gray-300 px-4 py-2 text-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {/* Button */}
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 rounded-r-2xl bg-blue-600 px-4 py-2 text-white 
                     hover:bg-blue-700 transition-colors shadow"
        >
          <Search size={18} />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
          
          <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-orange-500/30">
            <Clock className="w-5 h-5 text-orange-400" />
            <span className="text-lg font-mono font-bold text-orange-400">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}

      {isLoading ? <Loader/> : (
        <div className="flex h-[calc(100vh-80px)]">
        <div className="w-1/2 border-r border-slate-700/50 flex flex-col">
          <div className="bg-slate-800/60 backdrop-blur-sm px-6 py-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{question?.title}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(question?.difficulty)}`}>
                {question?.difficulty}
              </span>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-violet-300">Problem Description</h3>
                <p className="text-slate-300 leading-relaxed">
                  {question?.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-violet-300">Example</h3>
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                  <div className="space-y-2">
                    <div><span className="text-slate-400">Input:</span> nums = [2,7,11,15], target = 9</div>
                    <div><span className="text-slate-400">Output:</span> [0,1]</div>
                    <div><span className="text-slate-400">Explanation:</span> Because nums[0] + nums[1] == 9, we return [0, 1].</div>
                  </div>
                </div>
              </div>

              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-violet-300">Test Cases</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {question?.testcase.map((test : any, index : number) => (
                    <li key={index}>
                      <span className="text-slate-400">Input:</span> {JSON.stringify(test.input)}
                      <br />
                      <span className="text-slate-400">Expected:</span> {JSON.stringify(test.expected)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="w-1/2 flex flex-col">
          {/* Editor Header */}
          <div className="bg-slate-800/60 backdrop-blur-sm px-6 py-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-violet-400" />
                <span className="font-semibold">Solution</span>
              </div>
              <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Run Code</span>
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-slate-900/80 backdrop-blur-sm text-white p-4 font-mono text-sm resize-none outline-none border-none"
              style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
              spellCheck={false}
            />
          </div>

          {/* Submit Button */}
          <div className="bg-slate-800/60 backdrop-blur-sm px-6 py-4 border-t border-slate-700/50">
            <button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105" onClick={submitSolution}>
              Submit Solution
            </button>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm px-6 py-4 border-t border-slate-700/50">
            <button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105" onClick={getResult}>
              get result
            </button>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm px-6 py-4 border-t border-slate-700/50">
            <button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105" onClick={ calculateResult}>
              calculate
            </button>
          </div>
        </div>
      </div>
      )}
      
    </div>
  );
};

export default ContestPage;