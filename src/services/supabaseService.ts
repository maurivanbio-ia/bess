import { supabase } from '../config/supabaseClient';
import { BESSProject } from '../data/bessData';

export const fetchProjectsFromDB = async (): Promise<BESSProject[]> => {
  const { data, error } = await supabase
    .from('bess_projects')
    .select('data');

  if (error) {
    console.error('Erro ao buscar projetos do Supabase:', error);
    return [];
  }

  if (!data || data.length === 0) return [];

  // Mapeia o JSON armazenado de volta para os objetos BESSProject
  return data.map((row: any) => row.data as BESSProject);
};

export const saveProjectToDB = async (project: BESSProject): Promise<boolean> => {
  const { error } = await supabase
    .from('bess_projects')
    .upsert({ 
      id: project.id, 
      data: project,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    });

  if (error) {
    console.error('Erro ao salvar projeto no Supabase:', error);
    return false;
  }
  return true;
};

export const deleteProjectFromDB = async (projectId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('bess_projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error('Erro ao deletar projeto no Supabase:', error);
    return false;
  }
  return true;
};
