import { Link } from "react-router-dom";
import BusinessImage from "../assets/Business_SVG.svg";


const Hero = () => {
  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
	<div className="container flex flex-row items-center justify-between p-10">
		<div className="flex items-center justify-center p-6 mt-8 mx-auto">
			<img src={BusinessImage} alt="" className="object-contain h-96" />
		</div>
		<div className="flex flex-col justify-center p-6 text-center w-[50%] my-auto">
			<h1 className="text-5xl font-bold">A quick
				<span className="text-purple-600"> and simple</span> way to organize test.
			</h1>
			<p className="mt-6 mb-8 text-lg">Dictum aliquam porta in condimentum ac integer
				<br />turpis pulvinar, est scelerisque ligula sem
			</p>
			<div className="flex flex-col space-y-4">
				<Link to={"/admin"} className="px-8 py-3 text-lg font-semibold rounded bg-purple-600 text-gray-50">Organize quiz</Link>
				<Link to={"/user"} className="px-8 text-slate-600 py-3 text-lg font-semibold border rounded border-purple-800">Join quiz</Link>
			</div>
		</div>
	</div>
</div>
  );
};

export default Hero;
