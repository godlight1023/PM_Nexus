import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export function PersonalCard() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="w-16 h-16 rounded-full bg-zinc-800 overflow-hidden">
            {/* Placeholder for avatar */}
            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-100">PM Nexus</h2>
          <p className="text-sm text-zinc-400">产品经理 / 开发者 / 创作者</p>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          专注于打造高效的个人知识管理系统。热爱技术，探索 AI 与产品的结合。
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="https://github.com/godlight1023" target="_blank" className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <Github size={20} />
        </Link>
        <Link href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <Twitter size={20} />
        </Link>
        <Link href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <Linkedin size={20} />
        </Link>
        <Link href="mailto:godlight1023@gmail.com" className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <Mail size={20} />
        </Link>
      </div>
    </div>
  );
}
