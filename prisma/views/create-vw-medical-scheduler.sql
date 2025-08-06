DROP VIEW ponto.vw_medical_scheduler;

CREATE OR REPLACE VIEW ponto.vw_medical_scheduler AS
SELECT
  pts.nome AS procedimento,
  ae.agenda_exames_id AS id,
  ex.situacao AS situacaoexame,
  al.situacao AS situacaolaudo,
  ae.paciente_id,
  ae.data AS data_atendimento,
  ae.faturado AS pago,
  ae.inicio,
  ae.fim,
  ae.ativo,
  ae.telefonema AS confirmado,
  ae.data_cancelamento,
  ae.data_realizacao AS data_realizado,
  -- prioridade
  CASE
    WHEN COALESCE(ae.ordenador, '1') = '3' THEN 'urgent'
    WHEN date_part('year', age(current_date, pc.nascimento)) >= 80 THEN 'special'
    WHEN COALESCE(ae.ordenador, '1') = '2' THEN 'priority'
    ELSE 'normal'
  END AS prioridade,
  -- tipo_atendimento
  CASE
    WHEN (ae.forma_atendimento LIKE 'presencial%')
      THEN 'in_person'
    WHEN (ae.forma_atendimento LIKE 'telemedicina%')
      THEN 'telemedicine'
    ELSE 'unknown'
  END AS tipo_atendimento,
  -- dados do paciente
  pc.nome AS paciente_nome,
  CASE
    WHEN upper(pc.sexo) = 'M' THEN 'male'
    WHEN upper(pc.sexo) = 'F' THEN 'female'
    ELSE 'other'
  END as sexo,
  pc.nascimento,
  ae.status AS situacao,
  ae.medico_agenda AS agenda_do_medico,
  ae.pronto_atendimento,
  ae.situacao AS situacao_raw
FROM ponto.tb_agenda_exames ae
LEFT JOIN ponto.tb_paciente pc
  ON pc.paciente_id = ae.paciente_id
LEFT JOIN ponto.tb_exames ex
  ON ex.paciente_id = ae.paciente_id
  AND ex.agenda_exames_id = ae.agenda_exames_id
LEFT JOIN ponto.tb_ambulatorio_laudo al
  ON al.paciente_id = ae.paciente_id
  AND al.exame_id = ex.exames_id
LEFT JOIN ponto.tb_procedimento_convenio pcv
  ON pcv.procedimento_convenio_id = ae.procedimento_tuss_id
LEFT JOIN ponto.tb_procedimento_tuss pts
  ON pcv.procedimento_tuss_id = pts.procedimento_tuss_id
WHERE
  ae.situacao <> 'LIVRE'
  AND ae.paciente_id IS NOT NULL
ORDER BY pago, inicio;
