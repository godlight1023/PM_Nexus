import { Github, Twitter, Linkedin, Mail, MapPin, Zap, Layers } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profile } from "@/config/profile";

export function PersonalCard() {
  return (
    <div className="h-full p-6 flex flex-col gap-8">
      {/* Header Profile */}
      <div className="flex flex-col gap-4">
        <Avatar className="h-20 w-20 border-2 border-zinc-700/50">
          <AvatarImage src={profile.avatar} alt={profile.name} />
          <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold text-xl">
            {profile.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">{profile.name}</h1>
          <p className="text-zinc-400 font-medium text-sm flex items-center gap-1.5">
            {profile.title}
          </p>
        </div>

        <p className="text-sm text-zinc-500 leading-relaxed">
          {profile.bio}
        </p>

        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <MapPin size={14} />
          <span>{profile.location}</span>
        </div>
      </div>

      {/* Skills / Stack */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
          <Layers size={12} />
          Stack & Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span 
              key={skill} 
              className="px-2 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-[11px] text-zinc-300 font-medium hover:bg-zinc-800 hover:text-zinc-100 transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-auto pt-6 border-t border-zinc-800/50 flex flex-col gap-4">
        <div className="flex gap-4">
          <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
            <Github size={18} />
          </a>
          <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
            <Twitter size={18} />
          </a>
          <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
            <Linkedin size={18} />
          </a>
          <a href={profile.social.email} className="text-zinc-500 hover:text-white transition-colors">
            <Mail size={18} />
          </a>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400/80 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{profile.status}</span>
        </div>
      </div>
    </div>
  );
}
