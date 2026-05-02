/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurricularArea } from "./types";

export const CNEB_CURRICULUM: CurricularArea[] = [
  { 
    area: "Des. Personal, Ciudadanía y Cívica", 
    competences: ["Construye su identidad", "Convive y participa democráticamente en la búsqueda del bien común"] 
  },
  { 
    area: "Ciencias Sociales", 
    competences: ["Construye interpretaciones históricas", "Gestiona responsablemente el espacio y el ambiente", "Gestiona responsablemente los recursos económicos"] 
  },
  { 
    area: "Educación Física", 
    competences: ["Se desenvuelve de manera autónoma a través de su motricidad", "Asume una vida saludable", "Interactúa a través de sus habilidades sociomotrices"] 
  },
  { 
    area: "Arte y Cultura", 
    competences: ["Aprecia de manera crítica manifestaciones artístico-culturales", "Crea proyectos desde los lenguajes artísticos"] 
  },
  { 
    area: "Comunicación", 
    competences: ["Se comunica oralmente en su lengua materna", "Lee diversos tipos de textos escritos", "Escribe diversos tipos de textos"] 
  },
  { 
    area: "Inglés como Lengua Extranjera", 
    competences: ["Se comunica oralmente en inglés", "Lee diversos tipos de textos escritos en inglés", "Escribe diversos tipos de textos en inglés"] 
  },
  { 
    area: "Matemática", 
    competences: ["Resuelve problemas de cantidad", "Resuelve problemas de regularidad, equivalencia y cambio", "Resuelve problemas de forma, movimiento y localización", "Resuelve problemas de gestión de datos e incertidumbre"] 
  },
  { 
    area: "Ciencia y Tecnología", 
    competences: ["Indaga mediante métodos científicos", "Explica el mundo físico basándose en conocimientos", "Diseña y construye soluciones tecnológicas"] 
  },
  { 
    area: "Educación para el Trabajo", 
    competences: ["Gestiona proyectos de emprendimiento económico o social"] 
  },
  { 
    area: "Educación Religiosa", 
    competences: ["Construye su identidad como persona humana, amada por Dios", "Asume la experiencia del encuentro personal y comunitario con Dios"] 
  },
  { 
    area: "Competencias Transversales", 
    competences: ["Se desenvuelve en entornos virtuales generados por las TIC", "Gestiona su aprendizaje de manera autónoma"] 
  }
];

export const GRADE_PERIODS = ['b1', 'b2', 'b3', 'b4', 'final'] as const;

export const INITIAL_COMPETENCE_GRADES = {
  b1: '-',
  b2: '-',
  b3: '-',
  b4: '-',
  final: '-'
} as const;
