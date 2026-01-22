import { Lock, Globe, AlertCircle } from "lucide-react";
import { getNotionPages, isNotionConnected, type NotionPage } from "@/lib/notion";

function formatRelativeTime(dateString: string) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '刚刚';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}天前`;
    
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  } catch (e) {
    return dateString;
  }
}

export async function ContentStream() {
  let pages: NotionPage[] = [];
  const connected = isNotionConnected();
  try {
    pages = await getNotionPages();
  } catch (e) {
    console.error("ContentStream error:", e);
    // Keep pages empty or provide UI feedback
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto scrollbar-hide">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-white">动态流</h2>
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
           <div className="text-xs text-zinc-500 font-mono">{connected ? '在线' : '演示模式'}</div>
        </div>
      </div>
      
      {!connected && (
        <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-xs flex gap-2 items-start">
           <AlertCircle size={14} className="mt-0.5 shrink-0" />
           <div>
             <span className="font-semibold">Notion API 未配置</span>
             <p className="opacity-80 mt-1">请查看 NOTION_SETUP.md 以连接您的真实数据库。</p>
           </div>
        </div>
      )}

      {pages.length === 0 && (
        <div className="text-zinc-500 text-sm text-center py-10">
          暂无内容。
        </div>
      )}

      {pages.map((item) => (
        <a 
          key={item.id} 
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col gap-3 p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 transition-all duration-300 hover:border-zinc-700/50 cursor-pointer hover:shadow-xl hover:shadow-purple-900/10 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${
                item.type === 'Project' ? 'bg-blue-500/5 text-blue-400 border-blue-500/20' :
                item.type === 'Thought' ? 'bg-purple-500/5 text-purple-400 border-purple-500/20' :
                'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
              }`}>
                {item.type}
              </span>
              <span className="text-xs text-zinc-500">{formatRelativeTime(item.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.status === 'Private' ? (
                <Lock size={12} className="text-zinc-600" />
              ) : (
                <Globe size={12} className="text-zinc-600" />
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium text-zinc-200 group-hover:text-purple-200 transition-colors">
              {item.title}
            </h3>
            {item.excerpt && (
              <p className="mt-2 text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                {item.excerpt}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {item.tags.map((tag) => (
              <span key={tag} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">#{tag}</span>
            ))}
          </div>
        </a>
      ))}
    </div>
  );
}
