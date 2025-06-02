import { csvParser } from './index';
import { IKeyword } from '@/types';

const CHUNK_SIZE = 1000; // Process 1000 items at a time

export function flattenDataForCsv(data: IKeyword[], type: string) {
  let headers: string[] = ['Keyword', 'Device', 'Location', 'Date'];
  let rows: string[][] = [];

  const getHistoricalDates = (row: IKeyword) =>
    (row.historicalData || []).map((item: any) => item.date);

  const getKeywordData = (row: IKeyword, date: string, field: string) => {
    const entry = (row.historicalData || []).find(
      (item: any) => item.date === date
    );
    // Check if data is nested under 'data' field
    return entry?.keywordData?.data?.[field] || entry?.keywordData?.[field];
  };

  const buildBaseRow = (row: IKeyword, date: string) => ({
    keyword: row.term,
    device: row.device,
    location: row.location,
    date,
  });

  const handlers: Record<string, () => void> = {
    ai_overview: () => {
      const flattenedRows: any[] = [];

      const extractTextBlocks = (blocks: any[], base: any) => {
        blocks.forEach((block: any) => {
          if (block.type === 'paragraph') {
            flattenedRows.push({
              ...base,
              section: 'text_block',
              content_type: 'paragraph',
              snippet: block.snippet || '',
              title: '',
              link: '',
              source: '',
            });
          } else if (block.type === 'list') {
            const combined = (block.list || [])
              .map((item: any) => (item.snippet ? `• ${item?.snippet}` : ''))
              .join('\n');
            flattenedRows.push({
              ...base,
              section: 'text_block',
              content_type: 'list_item',
              snippet: combined,
              title: '',
              link: '',
              source: '',
            });
          } else if (block.type === 'expandable') {
            const newBase = {
              ...base,
              expandable_title: block.title || '',
              expandable_subtitle: block.subtitle || '',
            };
            extractTextBlocks(block.text_blocks || [], newBase);
          }
        });
      };

      data.forEach((row) => {
        getHistoricalDates(row).forEach((date: string) => {
          const entry = row.historicalData.find((h: any) => h.date === date);
          const aiOverview = entry?.keywordData?.data?.ai_overview;
          const base = {
            ...buildBaseRow(row, date),
            expandable_title: '',
            expandable_subtitle: '',
          };

          if (aiOverview?.text_blocks) {
            extractTextBlocks(aiOverview.text_blocks, base);
          }

          if (aiOverview?.references) {
            aiOverview.references.forEach((ref: any) => {
              flattenedRows.push({
                ...base,
                section: 'reference',
                content_type: 'reference',
                title: ref.title || '',
                link: ref.link || '',
                source: ref.source || '',
                snippet: ref.snippet || '',
              });
            });
          }
        });
      });

      headers = Array.from(
        new Set(flattenedRows.flatMap((row) => Object.keys(row)))
      );

      rows = flattenedRows.map((row) =>
        headers.map((header) => String(row[header] || '').replace(/"/g, '""'))
      );
      csvParser(
        [
          headers.join(','),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n'),
        `${type}_data.csv`,
        true
      );
    },

    reddit: () => {
      headers = [
        ...headers,
        'Title',
        'Snippet',
        'Link',
        'Source',
        'Site Links',
      ];

      // Process data in chunks
      for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        const chunk = data.slice(i, i + CHUNK_SIZE);
        chunk.forEach((row) => {
          getHistoricalDates(row).forEach((date: string) => {
            const entry = row.historicalData.find((h: any) => h.date === date);
            // Check both data structures
            const results =
              entry?.keywordData?.data?.organic_results ??
              entry?.keywordData?.organic_results ??
              [];
            results
              .filter((r: any) => /\breddit\b/i.test(r.source?.toLowerCase()))
              .forEach((result: any) => {
                rows.push([
                  row.term,
                  row.device,
                  row.location,
                  date,
                  result.title || '',
                  result.snippet || '',
                  result.link || '',
                  result.source || '',
                  (result?.sitelinks?.list || [])
                    .map((li: any) => `${li?.title}: ${li?.link}`)
                    .join('; '),
                ]);
              });
          });
        });

        // Write chunk to file
        if (i === 0) {
          csvParser(
            [
              headers.join(','),
              ...rows.map((row) =>
                row
                  .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                  .join(',')
              ),
            ].join('\n'),
            `${type}_data.csv`,
            true
          );
        } else {
          csvParser(
            rows
              .map((row) =>
                row
                  .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                  .join(',')
              )
              .join('\n'),
            `${type}_data.csv`,
            false
          );
        }
        rows = [];
      }
    },

    discussions_and_forums: () => {
      headers = [
        ...headers,
        'Title',
        'Source',
        'Link',
        'Forum Date',
        'Answers',
      ];

      // Process data in chunks
      for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        const chunk = data.slice(i, i + CHUNK_SIZE);
        chunk.forEach((row) => {
          getHistoricalDates(row).forEach((date: string) => {
            const entry = row.historicalData.find((h: any) => h.date === date);
            // Check both data structures
            const forum =
              entry?.keywordData?.data?.discussions_and_forums?.[0] ||
              entry?.keywordData?.discussions_and_forums?.[0];
            if (forum) {
              rows.push([
                row.term,
                row.device,
                row.location,
                date,
                forum.title || '',
                forum.source || '',
                forum.link || '',
                forum.date || '',
                (forum.answers || [])
                  .map((a: any) => `${a.snippet} (${a.link})`)
                  .join('; '),
              ]);
            }
          });
        });

        // Write chunk to file
        if (i === 0) {
          csvParser(
            [
              headers.join(','),
              ...rows.map((row) =>
                row
                  .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                  .join(',')
              ),
            ].join('\n'),
            `${type}_data.csv`,
            true
          );
        } else {
          csvParser(
            rows
              .map((row) =>
                row
                  .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                  .join(',')
              )
              .join('\n'),
            `${type}_data.csv`,
            false
          );
        }
        rows = [];
      }
    },

    inline_videos: () => {
      headers = [...headers, 'Title', 'Thumbnail', 'Link', 'Duration'];

      // Process data in chunks
      for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        const chunk = data.slice(i, i + CHUNK_SIZE);
        chunk.forEach((row) => {
          getHistoricalDates(row).forEach((date: string) => {
            const entry = row.historicalData.find((h: any) => h.date === date);
            // Check both data structures
            const video =
              entry?.keywordData?.data?.inline_videos?.[0] ||
              entry?.keywordData?.inline_videos?.[0];
            if (video) {
              rows.push([
                row.term,
                row.device,
                row.location,
                date,
                video.title || '',
                video.thumbnail || '',
                video.link || '',
                video.duration || '',
              ]);
            }
          });
        });

        // Write chunk to file
        if (i === 0) {
          csvParser(
            [
              headers.join(','),
              ...rows.map((row) =>
                row
                  .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                  .join(',')
              ),
            ].join('\n'),
            `${type}_data.csv`,
            true
          );
        } else {
          csvParser(
            rows
              .map((row) =>
                row
                  .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                  .join(',')
              )
              .join('\n'),
            `${type}_data.csv`,
            false
          );
        }
        rows = [];
      }
    },

    knowledge_graph: () => {
      headers = [
        ...headers,
        'Title',
        'Type',
        'KGMID',
        'Knowledge Graph Link',
        'Website',
        'Customer Service',
        'Date Founded',
        'President',
      ];

      // Process data in chunks
      for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        const chunk = data.slice(i, i + CHUNK_SIZE);
        chunk.forEach((row) => {
          getHistoricalDates(row).forEach((date: string) => {
            const entry = row.historicalData.find((h: any) => h.date === date);
            // Check both data structures
            const g =
              entry?.keywordData?.data?.knowledge_graph ||
              entry?.keywordData?.knowledge_graph;
            if (g) {
              rows.push([
                row.term,
                row.device,
                row.location,
                date,
                g.title || '',
                g.entity_type || '',
                g.kgmid || '',
                g.knowledge_graph_search_link || '',
                g.website || '',
                g.customer_service || '',
                g.date_founded || '',
                g.president || '',
              ]);
            }
          });
        });

        // Write chunk to file
        if (i === 0) {
          csvParser(
            [
              headers.join(','),
              ...rows.map((row) =>
                row
                  .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                  .join(',')
              ),
            ].join('\n'),
            `${type}_data.csv`,
            true
          );
        } else {
          csvParser(
            rows
              .map((row) =>
                row
                  .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                  .join(',')
              )
              .join('\n'),
            `${type}_data.csv`,
            false
          );
        }
        rows = [];
      }
    },

    related_questions: () => {
      headers = [
        ...headers,
        'Question',
        'Snippet',
        'Title',
        'Link',
        'List Items',
        'Displayed Link',
      ];

      // Process data in chunks
      for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        const chunk = data.slice(i, i + CHUNK_SIZE);
        chunk.forEach((row) => {
          getHistoricalDates(row).forEach((date: string) => {
            const entry = row.historicalData.find((h: any) => h.date === date);
            // Check both data structures
            const q =
              entry?.keywordData?.data?.related_questions?.[0] ||
              entry?.keywordData?.related_questions?.[0];
            if (q) {
              rows.push([
                row.term,
                row.device,
                row.location,
                date,
                q.question || '',
                q.snippet || '',
                q.title || '',
                q.link || '',
                (q.list || []).join('; '),
                q.displayed_link || '',
              ]);
            }
          });
        });

        // Write chunk to file
        if (i === 0) {
          csvParser(
            [
              headers.join(','),
              ...rows.map((row) =>
                row
                  .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                  .join(',')
              ),
            ].join('\n'),
            `${type}_data.csv`,
            true
          );
        } else {
          csvParser(
            rows
              .map((row) =>
                row
                  .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                  .join(',')
              )
              .join('\n'),
            `${type}_data.csv`,
            false
          );
        }
        rows = [];
      }
    },
  };

  if (handlers[type]) {
    handlers[type]();
  } else {
    // Default handler for unknown types
    headers = [
      ...headers,
      'KGMID',
      'KGM Title',
      'KGM Website',
      'Organic Results Count',
      'Tags',
      'Created At',
      'Updated At',
    ];

    // Process data in chunks
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      const chunk = data.slice(i, i + CHUNK_SIZE);
      chunk.forEach((row) => {
        getHistoricalDates(row).forEach((date: string) => {
          rows.push([
            row.term,
            row.device,
            row.location,
            date,
            row.kgmid || '',
            row.kgmTitle || '',
            row.kgmWebsite || '',
            row.organicResultsCount?.toString() || '0',
            (row.tags || []).join(', '),
            new Date(row.createdAt).toISOString(),
            new Date(row.updatedAt).toISOString(),
          ]);
        });
      });

      // Write chunk to file
      if (i === 0) {
        csvParser(
          [
            headers.join(','),
            ...rows.map((row) =>
              row
                .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                .join(',')
            ),
          ].join('\n'),
          `${type}_data.csv`,
          true
        );
      } else {
        csvParser(
          rows
            .map((row) =>
              row
                .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                .join(',')
            )
            .join('\n'),
          `${type}_data.csv`,
          false
        );
      }
      rows = [];
    }
  }
}
