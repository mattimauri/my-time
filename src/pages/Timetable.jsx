import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { getWorkingStatusChanges, getUserByTaxCode, generateReport, createCustomRecord } from '../../utils/api';
import jsPDF from 'jspdf';

const SuccessMessage = styled.p`
  color: #059669;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #d1fae5;
  border-radius: 0.25rem;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 767px) {
    margin: 1rem auto;
    padding: 0.75rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: #1f2937;

  @media (max-width: 767px) {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 768px) {
    font-size: 1.875rem;
  }
`;

const UserName = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;

  @media (max-width: 767px) {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #fef2f2;
  border-radius: 0.25rem;

  @media (max-width: 767px) {
    font-size: 0.8rem;
    padding: 0.4rem;
  }

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const LoadingText = styled.p`
  font-size: 0.875rem;
  color: #374151;
  margin-top: 1rem;

  @media (max-width: 767px) {
    font-size: 0.8rem;
  }

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const RecordsList = styled.div`
  margin-top: 1rem;

  @media (max-width: 767px) {
    margin-top: 0.75rem;
  }
`;

const NoRecordsText = styled.p`
  font-size: 0.875rem;
  color: #374151;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;

  @media (max-width: 767px) {
    font-size: 0.8rem;
    padding: 0.75rem;
  }

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const SummarySection = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 0.5rem;
  text-align: left;

  @media (max-width: 767px) {
    margin: 0.75rem 0;
    padding: 0.75rem;
  }
`;

const SummaryTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #111827;

  @media (max-width: 767px) {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
  }

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const SummaryItem = styled.div`
  background-color: white;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  text-align: center;

  @media (max-width: 767px) {
    padding: 0.6rem;
  }
`;

const SummaryLabel = styled.span`
  display: block;
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.25rem;

  @media (max-width: 767px) {
    font-size: 0.75rem;
  }
`;

const SummaryValue = styled.span`
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;

  @media (max-width: 767px) {
    font-size: 1rem;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;

  @media (max-width: 767px) {
    margin-top: 0.75rem;
    border-radius: 0.375rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  @media (max-width: 767px) {
    font-size: 0.75rem;
  }
`;

const Th = styled.th`
  background-color: #f9fafb;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;

  @media (max-width: 767px) {
    padding: 0.5rem;
    font-size: 0.7rem;
  }
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;

  @media (max-width: 767px) {
    padding: 0.5rem;
    font-size: 0.7rem;
  }
`;

const AdminTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #856404;

  @media (max-width: 767px) {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
`;


const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => props.status ? '#dcfce7' : '#fef2f2'};
  color: ${props => props.status ? '#166534' : '#991b1b'};

  @media (max-width: 767px) {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
      }
`;



const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.75rem;
  align-items: end;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const PeriodMessage = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f8fafc;
  border-left: 4px solid #3b82f6;
  border-radius: 0.25rem;
  text-align: left;

  @media (max-width: 767px) {
    font-size: 0.8rem;
    margin-bottom: 0.75rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 150px;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 767px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
    min-width: 120px;
  }

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const AdminSection = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 0.5rem;
  text-align: left;

  @media (max-width: 767px) {
    margin: 0.75rem 0;
    padding: 0.75rem;
  }
`;


const AddButton = styled(Button)`
  background-color: #dc2626;
  color: white;

  &:hover {
    background-color: #b91c1c;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;


const BackButton = styled(Button)`
  background-color: #6b7280;
  color: white;

  &:hover {
    background-color: #4b5563;
  }
`;

const DownloadButton = styled(Button)`
  background-color: #059669;
  color: white;

  &:hover {
    background-color: #047857;
  }
`;

// Funzione per calcolare il totale ore del mese
const calculateMonthlyHours = (records) => {
  if (!records || records.length === 0) return 0;

  // Ordina i record in ordine cronologico
  const sortedRecords = [...records].sort((a, b) =>
    new Date(a.changed_at) - new Date(b.changed_at)
  );

  let totalHours = 0;
  let activeStart = null;

  for (const record of sortedRecords) {
    const currentTime = new Date(record.changed_at);

    if (record.new_status === true) {
      // Inizio periodo lavorativo
      activeStart = currentTime;
    } else if (record.new_status === false && activeStart !== null) {
      // Fine periodo lavorativo - calcola le ore
      const hoursDiff = (currentTime - activeStart) / (1000 * 60 * 60);
      totalHours += hoursDiff;
      activeStart = null;
    }
  }

  // Se c'è un periodo attivo che non è stato chiuso, non lo contiamo
  // (perché non sappiamo quando è finito)

  return totalHours;
};

// Funzione per generare il PDF
// Funzione per generare il PDF senza autoTable
const generatePDF = (reportData) => {
  const doc = new jsPDF();

  // Configurazioni
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Titolo
  doc.setFontSize(18);
  doc.setTextColor(33, 33, 33);
  doc.text('REPORT STATO LAVORATIVO', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Informazioni utente
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Utente: ${reportData.user.first_name || ''} ${reportData.user.last_name || ''}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Codice Fiscale: ${reportData.user.tax_code}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Periodo: ${reportData.period.month}/${reportData.period.year}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Data generazione: ${new Date(reportData.generated_at).toLocaleDateString('it-IT')}`, 20, yPosition);
  yPosition += 15;

  // Totale ore
  doc.setFontSize(14);
  doc.setTextColor(0, 100, 0);
  doc.text(`TOTALE ORE LAVORATIVE: ${reportData.total_hours.toFixed(2)} ore`, 20, yPosition);
  yPosition += 20;

  // Intestazione tabella
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(59, 130, 246);
  doc.rect(20, yPosition, pageWidth - 40, 8, 'F');
  doc.text('DATA', 25, yPosition + 5);
  doc.text('ORA', 80, yPosition + 5);
  doc.text('STATO', 120, yPosition + 5);
  yPosition += 12;

  // Record della tabella con orari corretti (+2 ore)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);

  reportData.records.forEach((record, index) => {
    // Converti UTC a ora italiana (+2 ore)
    const utcDate = new Date(record.changed_at);
    // const utcDate = new Date(utcDate.getTime() + (2 * 60 * 60 * 1000)); // Aggiungi 2 ore

    const dateDisplay = utcDate.toLocaleDateString('it-IT');
    const timeDisplay = utcDate.toLocaleTimeString('it-IT');

    // Alterna colore di sfondo per le righe
    if (index % 2 === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPosition - 4, pageWidth - 40, 8, 'F');
    }

    doc.text(dateDisplay, 25, yPosition);
    doc.text(timeDisplay, 80, yPosition);
    doc.text(record.new_status ? 'OCCUPATO' : 'NON OCCUPATO', 120, yPosition);

    yPosition += 8;

    // Controlla se serve una nuova pagina
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;

      // Ripeti l'intestazione nella nuova pagina
      doc.setFillColor(59, 130, 246);
      doc.rect(20, yPosition, pageWidth - 40, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('DATA', 25, yPosition + 5);
      doc.text('ORA', 80, yPosition + 5);
      doc.text('STATO', 120, yPosition + 5);
      yPosition += 12;
      doc.setTextColor(0, 0, 0);
    }
  });

  // Pie di pagina
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Documento generato automaticamente - Timetable Peirano', pageWidth / 2, 290, { align: 'center' });

  // Salva il PDF
  const fileName = `report_${reportData.user.tax_code}_${reportData.period.month}_${reportData.period.year}.pdf`;
  doc.save(fileName);
};

function Timetable() {
  const [records, setRecords] = useState([]);
  const [user, setUser] = useState(null);
  const [todayHours, setTodayHours] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [customDateTime, setCustomDateTime] = useState('');
  const [customStatus, setCustomStatus] = useState(true);
  const [addingRecord, setAddingRecord] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonthName, setCurrentMonthName] = useState('');
  const [periodMessage, setPeriodMessage] = useState('');


  // Nomi dei mesi in italiano
  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  // Aggiorna il nome del mese quando currentMonth cambia
  useEffect(() => {
    setCurrentMonthName(monthNames[currentMonth - 1]);
  }, [currentMonth]);

  // Calcola mese e anno precedente
  const prevMonthDate = new Date(currentYear, currentMonth - 2, 1);
  // currentMonth è 1-based (gennaio = 1), quindi -2 per ottenere il mese precedente
  const prevMonth = prevMonthDate.getMonth() + 1;
  const prevYear = prevMonthDate.getFullYear();
  const prevMonthName = monthNames[prevMonth - 1];


  const addHoursAcrossDays = (start, end, bucket) => {
    let current = new Date(start);
    while (current < end) {
      const endOfDay = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate(),
        23, 59, 59, 999
      );
      const sliceEnd = end < endOfDay ? end : endOfDay;
      const hours = (sliceEnd - current) / (1000 * 60 * 60);
      const key = current.toLocaleDateString('it-IT');
      bucket[key] = (bucket[key] || 0) + hours;
      current = new Date(sliceEnd.getTime() + 1);
    }
  };

  const handleDownloadPDF = async () => {
    if (!user) return;

    setDownloading(true);
    try {
      // Calcola mese precedente
      const prevMonthDate = new Date(currentYear, currentMonth - 2, 1);
      const prevMonth = prevMonthDate.getMonth() + 1;
      const prevYear = prevMonthDate.getFullYear();

      const reportData = {
        tax_code: user.tax_code,
        month: prevMonth,
        year: prevYear
      };

      console.log("📤 Invio richiesta report:", reportData);

      const response = await generateReport(reportData);

      if (response.success) {
        generatePDF(response.report);
      } else {
        alert('Errore nella generazione del report: ' + response.error);
      }
    } catch (error) {
      console.error('Errore download PDF:', error);
      alert('Errore durante il download del PDF');
    } finally {
      setDownloading(false);
    }
  };



  const handleAddCustomRecord = async (e) => {
    e.preventDefault();

    if (!customDateTime) {
      setError('Seleziona data e ora');
      return;
    }

    setAddingRecord(true);
    setError('');
    setSuccessMessage('');

    try {
      const recordData = {
        tax_code: user.tax_code,
        new_status: customStatus,
        custom_datetime: customDateTime
      };

      const response = await createCustomRecord(recordData);

      // La risposta dovrebbe essere 201 Created con success: true
      if (response.success) {
        let successMsg = `Record aggiunto: ${response.record.changed_at_display}`;

        // Se lo stato utente è stato aggiornato, aggiungi questa informazione
        if (response.user_updated) {
          successMsg += ` - Stato utente aggiornato a: ${customStatus ? 'Occupato' : 'Non occupato'}`;

          // Aggiorna anche lo stato locale dell'utente
          setUser(prevUser => ({
            ...prevUser,
            working_status: customStatus
          }));
        }

        setSuccessMessage(successMsg);
        setCustomDateTime('');

        // Aggiungi il nuovo record direttamente allo stato senza ricaricare tutto
        const newRecord = {
          id: response.record.id,
          tax_code: response.record.tax_code,
          new_status: response.record.new_status,
          changed_at: response.record.changed_at
        };

        // Aggiungi il nuovo record e riordina per data
        const updatedRecords = [...records, newRecord]
          .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));

        setRecords(updatedRecords);

        // Ricalcola le ore con i nuovi dati
        recalculateHours(updatedRecords);
      }
    } catch (error) {
      console.error('Errore aggiunta record:', error);
      // Gestisci diversi tipi di errore
      if (error.response) {
        // Il server ha risposto con un errore
        setError(error.response.data?.error || 'Errore durante l\'aggiunta del record');
      } else if (error.request) {
        // La richiesta è stata fatta ma non c'è risposta
        setError('Impossibile contattare il server');
      } else {
        // Altro tipo di errore
        setError('Errore durante l\'aggiunta del record');
      }
    } finally {
      setAddingRecord(false);
    }
  };

  // Funzione per ricalcolare le ore dopo l'aggiunta di un record
  const recalculateHours = (records) => {
    const now = new Date();
    const daily = {};
    let activeStart = null;

    const chronologicalRecords = [...records].sort((a, b) => new Date(a.changed_at) - new Date(b.changed_at));

    for (const r of chronologicalRecords) {
      const t = new Date(r.changed_at);
      if (r.new_status === true) {
        activeStart = t;
      } else if (r.new_status === false && activeStart && t > activeStart) {
        addHoursAcrossDays(activeStart, t, daily);
        activeStart = null;
      }
    }

    if (activeStart) {
      addHoursAcrossDays(activeStart, now, daily);
    }

    const todayKey = now.toLocaleDateString('it-IT');
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 6);
    const monthStart = new Date(now);
    monthStart.setDate(monthStart.getDate() - 29);

    let week = 0;
    let month = 0;
    const today = daily[todayKey] || 0;

    for (const [day, hours] of Object.entries(daily)) {
      const [dd, mm, yyyy] = day.split('/');
      const dayDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd), 12);
      if (dayDate >= weekStart && dayDate <= now) week += hours;
      if (dayDate >= monthStart && dayDate <= now) month += hours;
    }

    setTodayHours(today);
    setWeeklyHours(week);
    setMonthlyHours(month);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const taxCode = params.get('tax_code') || '';

        if (!taxCode) {
          setError('Codice fiscale mancante');
          setLoading(false);
          return;
        }

        const userRes = await getUserByTaxCode(taxCode);
        const currentUser = userRes?.user || null;
        setUser(currentUser);

        // Controlla se l'utente è admin
        if (currentUser?.role === 'admin') {
          setIsAdmin(true);
        }


        const response = await getWorkingStatusChanges(taxCode, currentMonth, currentYear);
        const cambiamenti = (response?.cambiamenti || [])
          .filter(r => !isNaN(new Date(r.changed_at).getTime()))
          .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));

        setRecords(cambiamenti);

        if (response.periodo) {
          setCurrentMonthName(response.periodo.mese_nome);
        }

        if (response.messaggio) {
          setPeriodMessage(response.messaggio);
        }

        // Calcola le ore iniziali
        recalculateHours(cambiamenti);

        setLoading(false);
      } catch (err) {
        console.error('Errore API:', err);
        let errorMessage = 'Errore nel caricamento dei record';
        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = 'Non autorizzato: effettua il login';
            navigate('/login');
          } else if (err.response.status === 403) {
            errorMessage = 'Accesso negato: solo admin possono accedere';
          } else if (err.response.status === 400) {
            errorMessage = err.response.data.error || 'Richiesta non valida';
          }
        } else if (err.request) {
          errorMessage = 'Impossibile contattare il server';
        } else {
          errorMessage = 'Errore nella configurazione della richiesta';
        }
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchAll();
  }, [location, navigate]);

  return (
    <Container>
      <Title>Cronologia Stato Lavorativo</Title>
      {user && (
        <UserName>
          {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Utente'} - {currentMonthName} {currentYear}
        </UserName>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

      <ButtonGroup>
        <BackButton onClick={() => navigate('/')}>Torna alla Home</BackButton>
        {records.length > 0 && (
          <DownloadButton
            onClick={handleDownloadPDF}
            disabled={downloading}
          >
            {downloading ? 'Generando...' : `PDF Report ${prevMonthName} ${prevYear}`}
          </DownloadButton>
        )}
      </ButtonGroup>

      {/* SEZIONE ADMIN PER AGGIUNGERE RECORD CUSTOM */}
      <AdminSection>
        <AdminTitle>Aggiungi Record Manuale (Admin)</AdminTitle>
        <Form onSubmit={handleAddCustomRecord}>
          <FormGroup>
            <Label>Data e Ora</Label>
            <Input
              type="datetime-local"
              value={customDateTime}
              onChange={(e) => setCustomDateTime(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Stato</Label>
            <Select
              value={customStatus}
              onChange={(e) => setCustomStatus(e.target.value === 'true')}
            >
              <option value="true">Occupato</option>
              <option value="false">Non occupato</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <AddButton
              type="submit"
              disabled={addingRecord || !customDateTime}
            >
              {addingRecord ? 'Aggiungendo...' : 'Aggiungi Record'}
            </AddButton>
          </FormGroup>
        </Form>
      </AdminSection>



      {loading ? (
        <LoadingText>Caricamento...</LoadingText>
      ) : (
        <RecordsList>
          {/* RIEPILOGHI */}
          <SummarySection>
            <SummaryTitle>Riepilogo Ore Lavorative</SummaryTitle>
            <SummaryGrid>
              <SummaryItem>
                <SummaryLabel>Oggi</SummaryLabel>
                <SummaryValue>{todayHours.toFixed(2)}h</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Questa Settimana</SummaryLabel>
                <SummaryValue>{weeklyHours.toFixed(2)}h</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Questo Mese</SummaryLabel>
                <SummaryValue>{monthlyHours.toFixed(2)}h</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Totale Mese Corrente</SummaryLabel>
                <SummaryValue>{calculateMonthlyHours(records).toFixed(2)}h</SummaryValue>
              </SummaryItem>
            </SummaryGrid>
          </SummarySection>

          {/* TABELLA CAMBIAMENTI */}
          {records.length === 0 ? (
            <NoRecordsText>Nessun cambiamento trovato.</NoRecordsText>
          ) : (

            <>
              <PeriodMessage>
                {periodMessage || `Record del mese ${currentMonthName} ${currentYear}`}
              </PeriodMessage>
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <Th>Stato</Th>
                      <Th>Data/Ora</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(record => (
                      <tr key={record.id}>
                        <Td>
                          <StatusBadge status={record.new_status}>
                            {record.new_status ? 'Occupato' : 'Non occupato'}
                          </StatusBadge>
                        </Td>
                        <Td>{new Date(record.changed_at).toLocaleString('it-IT')}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            </>
          )}
        </RecordsList>
      )}
    </Container>
  );
}

export default Timetable;