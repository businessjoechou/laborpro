// save.js — LaborPro 計算紀錄儲存（tool 前綴 lp- 以區分 InheritancePro）
import { supabase } from './auth.js';

export async function saveCalculation({ tool, title, summary, data }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '請先登入' };

  // 確保 tool 名稱有 lp- 前綴
  const prefixedTool = tool.startsWith('lp-') ? tool : 'lp-' + tool;

  const { error } = await supabase.from('calculations').insert({
    user_id: user.id,
    tool: prefixedTool,
    title,
    summary,
    data
  });
  return error ? { error: error.message } : { success: true };
}

export async function getCalculations() {
  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .like('tool', 'lp-%')
    .order('created_at', { ascending: false })
    .limit(50);
  return error ? [] : (data || []);
}

export async function deleteCalculation(id) {
  const { error } = await supabase.from('calculations').delete().eq('id', id);
  return !error;
}
