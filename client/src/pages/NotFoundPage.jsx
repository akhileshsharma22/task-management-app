import { ArrowLeft, ListTodo } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return <main className="grid min-h-screen place-items-center p-6 text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-indigo-600 text-white"><ListTodo /></span><p className="mt-6 text-sm font-bold text-indigo-600">404</p><h1 className="mt-2 text-3xl font-extrabold">This page wandered off</h1><p className="mt-2 text-sm text-slate-500">The page you are looking for does not exist.</p><Link className="btn-primary mt-6" to="/dashboard"><ArrowLeft size={17} />Back to dashboard</Link></div></main>;
}
